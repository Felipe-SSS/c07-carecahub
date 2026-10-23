import { Module } from '@nestjs/common';
import { MentorService } from './mentor.service.js';
import { MentorController } from './mentor.controller.js';

@Module({
  controllers: [MentorController],
  providers: [MentorService],
})
export class MentorModule {}
