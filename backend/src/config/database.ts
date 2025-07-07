import knex from 'knex';
import config from '../../knexfile';

const environment = process.env['NODE_ENV'] || 'development';
const dbConfig = config[environment];

// Create Knex instance
export const db = knex(dbConfig);

// Database connection function
export const connectDB = async (): Promise<void> => {
  try {
    // Test the connection
    await db.raw('SELECT 1');
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Graceful shutdown
export const closeDB = async (): Promise<void> => {
  try {
    await db.destroy();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
};

// Health check
export const checkDBHealth = async (): Promise<boolean> => {
  try {
    await db.raw('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Export database instance for use in models
export default db; 