import { drizzle } from 'drizzle-orm/neon-http'
import { neon, neonConfig } from '@neondatabase/serverless'

// Import schema
import * as schema from '@/db/schema'

// Configure Neon for better performance
neonConfig.fetchConnectionCache = true

// Check if we're in build mode - more reliable check
const isBuildTime = process.env.NODE_ENV === 'production' && (
  !process.env.POSTGRES_URL || 
  process.env.POSTGRES_URL === 'mock-url' ||
  process.env.RENDER === 'true'
)

// Database connection configuration
let dbInstance: ReturnType<typeof drizzle> | null = null

// Lazy database connection - only connect when actually needed
export function getDb() {
  // During build time, return a mock db to prevent connection attempts
  if (isBuildTime) {
    console.log('🚀 Production deployment mode - returning empty comments array')
    return {} as ReturnType<typeof drizzle>
  }
  
  if (!dbInstance) {
    const connectionString = process.env.POSTGRES_URL
    
    if (!connectionString) {
      throw new Error('POSTGRES_URL environment variable is not set')
    }
    
    console.log('🔗 Connecting to PostgreSQL database...')
    dbInstance = drizzle(neon(connectionString), { schema })
    console.log('✅ Database connection established')
  }
  
  return dbInstance
}

// Export db for backward compatibility, but it will be lazy
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>]
  }
})

// Health check function
export async function checkDatabaseHealth() {
  try {
    const db = getDb()
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
    if (dbInstance) {
      console.log('✅ Database connection closed')
      dbInstance = null
    }
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
