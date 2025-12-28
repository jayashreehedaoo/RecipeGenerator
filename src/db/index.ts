import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Initialize libsql database
let dbInstance: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  // Create libsql client
  const client = createClient({
    url: 'file:./dev.db',
  });

  // Create Drizzle instance
  dbInstance = drizzle(client, { schema });

  return dbInstance;
}

export { schema };
