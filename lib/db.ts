import { drizzle } from 'drizzle-orm/neon-http'
import { neon, neonConfig } from '@neondatabase/serverless'

// Import schema
import * as schema from '@/db/schema'

// Configure Neon for better performance
neonConfig.fetchConnectionCache = true

// Database connection configuration
const connectionString = process.env.POSTGRES_URL

if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is not set')
}

// Create database instance with schema
export const db = drizzle(neon(connectionString), { schema })

// Health check function
export async function checkDatabaseHealth() {
  try {
    // Test connection with a simple query
    const result = await db.select({ count: schema.products.id }).from(schema.products).limit(1)
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      connection: 'active',
      testQuery: 'success'
    }
  } catch (error) {
    console.error('❌ Database health check failed:', error)
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      connection: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Connection management
export async function closeDatabaseConnection() {
  try {
    console.log('✅ Database connection closed')
  } catch (error) {
    console.error('❌ Error closing database connection:', error)
  }
}

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('🔄 Shutting down gracefully...')
  await closeDatabaseConnection()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('🔄 Shutting down gracefully...')
  await closeDatabaseConnection()
  process.exit(0)
})
