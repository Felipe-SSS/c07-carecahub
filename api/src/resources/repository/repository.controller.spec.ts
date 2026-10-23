import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryController } from './repository.controller.js';
import { RepositoryService } from './repository.service.js';

describe('RepositoryController', () => {
  let controller: RepositoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepositoryController],
      providers: [RepositoryService],
    }).compile();

    controller = module.get<RepositoryController>(RepositoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
