import type { User } from '@db';

type PublicUser = Omit<User, 'password'>;

export class UserEntity implements PublicUser {
  id: number;
  name: string;
  email: string;
  github: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(user: PublicUser) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.github = user.github;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
  }
}
