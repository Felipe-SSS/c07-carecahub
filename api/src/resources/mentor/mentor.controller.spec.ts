import { Test, TestingModule } from '@nestjs/testing';
import { MentorController } from './mentor.controller.js';
import { MentorService } from './mentor.service.js';

describe('MentorController', () => {
  let controller: MentorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MentorController],
      providers: [MentorService],
    }).compile();

    controller = module.get<MentorController>(MentorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
