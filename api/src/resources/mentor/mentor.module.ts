import { Module } from '@nestjs/common';
import { MentorService } from './mentor.service.js';
import { MentorController } from './mentor.controller.js';

@Module({
  providers: [MentorService],
  controllers: [MentorController]
})
export class MentorModule {}
