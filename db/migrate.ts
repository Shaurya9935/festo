import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';

async function run() {
  // 1. Create a dedicated client just for this migration script
  const migrationClient = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    await migrationClient.connect();
    
    // 2. Initialize a temporary Drizzle instance
    const db = drizzle(migrationClient);
    
    console.log('Starting migration...');
    // 3. Run the migration (Make sure the path matches your drizzle config 'out' folder)
    await migrate(db, { migrationsFolder: './drizzle' }); 
    
    console.log('Migration successful!');
  } catch (error) {
    console.error('MIGRATION FAILED WITH ERROR:');
    console.error(error); // This will spit out the exact Postgres constraint blocking you
  } finally {
    console.log('Closing database connection...');
    // 4. Force the connection to close so the terminal doesn't hang
    await migrationClient.end(); 
    process.exit(0);
  }
}

run();