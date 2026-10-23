import { schema } from '../../drizzle/index.js';
import { Injectable, Logger, type OnModuleDestroy } from '@nestjs/common';
import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2';
import type { Logger as DrizzleLogger } from 'drizzle-orm/logger';
import { createPool, type Pool } from 'mysql2/promise';

class NestDrizzleLogger implements DrizzleLogger {
  constructor(private readonly logger: Logger) {}

  logQuery(query: string, _params: unknown[]): void {
    this.logger.debug(query);
  }
}

export type DrizzleDatabase = MySql2Database<typeof schema>;
export type DrizzleTransactionClient = Parameters<Parameters<DrizzleDatabase['transaction']>[0]>[0];

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  readonly db: DrizzleDatabase;
  readonly schema = schema;

  private readonly logger = new Logger(DrizzleService.name);
  private readonly pool: Pool;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not defined');
    }

    this.pool = createPool(databaseUrl);
    this.db = drizzle({
      client: this.pool,
      schema,
      mode: 'default',
      logger: new NestDrizzleLogger(this.logger),
    });
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting from database...');
    await this.pool.end();
    this.logger.log('Disconnected from database');
  }
}
