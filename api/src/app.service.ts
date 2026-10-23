import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): string {
    return JSON.stringify({ status: 'ok' });
  }
}
