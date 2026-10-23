import { Module } from '@nestjs/common';
import { StudentService } from './student.service.js';
import { StudentController } from './student.controller.js';

@Module({
  providers: [StudentService],
  controllers: [StudentController]
})
export class StudentModule {}
