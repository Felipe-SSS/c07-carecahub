import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service.js';
import { TicketController } from './ticket.controller.js';

@Module({
  providers: [TicketService],
  controllers: [TicketController]
})
export class TicketModule {}
