import { schema } from '@db';
import { DrizzleService } from './drizzle.service.js';

describe('DrizzleService', () => {
  it('exposes the CarecaHub schema and closes its pool', async () => {
    const service = new DrizzleService();

    expect(service.schema).toBe(schema);
    expect(service.db).toBeDefined();

    await expect(service.onModuleDestroy()).resolves.toBeUndefined();
  });
});
