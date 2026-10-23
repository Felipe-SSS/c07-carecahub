import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DrizzleModule } from './providers/drizzle/drizzle.module.js';
import { GroupModule } from './resources/group/group.module.js';
import { MentorModule } from './resources/mentor/mentor.module.js';
import { ProjectModule } from './resources/project/project.module.js';
import { RepositoryModule } from './resources/repository/repository.module.js';
import { StudentModule } from './resources/student/student.module.js';
import { TeacherModule } from './resources/teacher/teacher.module.js';
import { TicketModule } from './resources/ticket/ticket.module.js';
import { UserModule } from './resources/user/user.module.js';
import { GroupController } from './resources/group/group.controller.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? '',
      appSecret: process.env.OBSERVE_APP_SECRET ?? '',
      runtimeMetrics: !Boolean(process.versions?.['webcontainer']),
      serviceId: 'nest-typescript-starter',
    }),
    DrizzleModule,
    GroupModule,
    MentorModule,
    ProjectModule,
    RepositoryModule,
    StudentModule,
    TeacherModule,
    TicketModule,
    UserModule,
  ],
  controllers: [AppController, GroupController],
  providers: [AppService],
})
export class AppModule {}
