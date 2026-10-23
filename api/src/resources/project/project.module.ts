import { Module } from '@nestjs/common';
import { ProjectService } from './project.service.js';
import { ProjectController } from './project.controller.js';

@Module({
  providers: [ProjectService],
  controllers: [ProjectController]
})
export class ProjectModule {}
