import { BadRequestException, HttpStatus, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { HTTP_CODE_METADATA, PIPES_METADATA, ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import type { UserEntity } from './entities/user.entity.js';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

const publicUser: UserEntity = {
  id: 7,
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  github: 'ada',
  createdAt: new Date('2026-10-23T10:00:00.000Z'),
  updatedAt: new Date('2026-10-23T10:00:00.000Z'),
  deletedAt: null,
};

describe('UserController', () => {
  let controller: UserController;
  const userService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('delegates every CRUD operation and returns public entities', async () => {
    const createDto = {
      name: publicUser.name,
      email: publicUser.email,
      password: 'secure-password',
      github: publicUser.github,
    };
    const updateDto = { name: 'Ada King' };
    userService.create.mockResolvedValue(publicUser);
    userService.findAll.mockResolvedValue([publicUser]);
    userService.findOne.mockResolvedValue(publicUser);
    userService.update.mockResolvedValue(publicUser);
    userService.delete.mockResolvedValue(undefined);

    await expect(controller.create(createDto)).resolves.toBe(publicUser);
    await expect(controller.findAll()).resolves.toEqual([publicUser]);
    await expect(controller.findOne(publicUser.id)).resolves.toBe(publicUser);
    await expect(controller.update(publicUser.id, updateDto)).resolves.toBe(publicUser);
    await expect(controller.delete(publicUser.id)).resolves.toBeUndefined();

    expect(userService.create).toHaveBeenCalledWith(createDto);
    expect(userService.findOne).toHaveBeenCalledWith(publicUser.id);
    expect(userService.update).toHaveBeenCalledWith(publicUser.id, updateDto);
    expect(userService.delete).toHaveBeenCalledWith(publicUser.id);
  });

  it('configures integer route parsing and a no-content delete response', () => {
    const routeArguments = Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      UserController,
      'findOne',
    ) as Record<string, { data: string; pipes: unknown[] }>;
    const idArgument = Object.values(routeArguments).find((argument) => argument.data === 'id');

    expect(idArgument?.pipes).toContain(ParseIntPipe);
    expect(Reflect.getMetadata(HTTP_CODE_METADATA, UserController.prototype.delete)).toBe(
      HttpStatus.NO_CONTENT,
    );
  });

  it('rejects invalid and unrecognized request fields through the controller validation pipe', async () => {
    const controllerPipes = Reflect.getMetadata(PIPES_METADATA, UserController) as ValidationPipe[];
    const validationPipe = controllerPipes.find((pipe) => pipe instanceof ValidationPipe);

    await expect(
      validationPipe?.transform(
        {
          name: '',
          email: 'not-an-email',
          password: 'short',
          github: 'ada',
          role: 'admin',
        },
        { metatype: CreateUserDto, type: 'body', data: undefined },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects an otherwise-valid payload with an unrecognized field', async () => {
    const controllerPipes = Reflect.getMetadata(PIPES_METADATA, UserController) as ValidationPipe[];
    const validationPipe = controllerPipes.find((pipe) => pipe instanceof ValidationPipe);

    await expect(
      validationPipe?.transform(
        {
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          password: 'secure-password',
          github: 'ada',
          role: 'admin',
        },
        { metatype: CreateUserDto, type: 'body', data: undefined },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
