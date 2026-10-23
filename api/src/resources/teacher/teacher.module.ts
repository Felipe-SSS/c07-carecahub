import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service.js';
import { TeacherController } from './teacher.controller.js';

@Module({
  providers: [TeacherService],
  controllers: [TeacherController]
})
export class TeacherModule {}
