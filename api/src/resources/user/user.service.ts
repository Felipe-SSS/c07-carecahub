import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { NewUser, User } from '@db';
import { and, eq, isNull, ne } from 'drizzle-orm';
import { users } from '@/drizzle/schema/entities/user.js';
import { DrizzleService } from '@/providers/drizzle/drizzle.service.js';
import { hashPassword } from '@/utils/password.js';
import { isUniqueViolation } from '@/utils/query-violations.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserEntity } from './entities/user.entity.js';

const publicUserFields = {
  id: users.id,
  name: users.name,
  email: users.email,
  github: users.github,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
  deletedAt: users.deletedAt,
};

type PublicUser = Omit<User, 'password'>;

@Injectable()
export class UserService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    await this.assertEmailIsAvailable(createUserDto.email);

    const now = new Date();

    try {
      const [inserted] = await this.drizzleService.db
        .insert(users)
        .values({
          name: createUserDto.name,
          email: createUserDto.email,
          password: await hashPassword(createUserDto.password),
          github: createUserDto.github,
          createdAt: now,
          updatedAt: now,
        })
        .$returningId();

      return this.findOne(inserted.id);
    } catch (error) {
      this.throwConflictForUniqueViolation(error);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    const activeUsers = await this.drizzleService.db
      .select(publicUserFields)
      .from(users)
      .where(isNull(users.deletedAt));

    return activeUsers.map((user) => new UserEntity(user));
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.findActiveUser(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    return new UserEntity(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const currentUser = await this.findActiveUser(id);

    if (!currentUser) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== currentUser.email) {
      await this.assertEmailIsAvailable(updateUserDto.email, id);
    }

    const values: Partial<NewUser> = {
      ...(updateUserDto.name !== undefined ? { name: updateUserDto.name } : {}),
      ...(updateUserDto.email !== undefined
        ? { email: updateUserDto.email }
        : {}),
      ...(updateUserDto.github !== undefined
        ? { github: updateUserDto.github }
        : {}),
      updatedAt: new Date(),
    };

    if (updateUserDto.password !== undefined) {
      values.password = await hashPassword(updateUserDto.password);
    }

    try {
      await this.drizzleService.db
        .update(users)
        .set(values)
        .where(and(eq(users.id, id), isNull(users.deletedAt)));
    } catch (error) {
      this.throwConflictForUniqueViolation(error);
    }

    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const user = await this.findActiveUser(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    const now = new Date();

    await this.drizzleService.db
      .update(users)
      .set({ deletedAt: now, updatedAt: now })
      .where(and(eq(users.id, id), isNull(users.deletedAt)));
  }

  private async findActiveUser(id: number): Promise<PublicUser | undefined> {
    const [user] = await this.drizzleService.db
      .select(publicUserFields)
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)));

    return user;
  }

  private async assertEmailIsAvailable(
    email: string,
    currentUserId?: number,
  ): Promise<void> {
    const condition = currentUserId
      ? and(eq(users.email, email), ne(users.id, currentUserId))
      : eq(users.email, email);
    const [existingUser] = await this.drizzleService.db
      .select({ id: users.id })
      .from(users)
      .where(condition);

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }
  }

  private throwConflictForUniqueViolation(error: unknown): never {
    if (isUniqueViolation(error)) {
      throw new ConflictException('A user with this email already exists');
    }

    throw error;
  }
}
