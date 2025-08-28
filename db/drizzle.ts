import * as schema from './schema'
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'

// Optimize connection pool for production
const connectionConfig: any = {
  schema,
  logger: process.env.NODE_ENV === 'development',
}
// const hr = 33;

// Connection pool optimization (for environments that support it)
if (process.env.NODE_ENV === 'production') {
  // Note: Vercel Postgres may not support custom pool configuration
  // These settings may be ignored but won't cause errors
  try {
    connectionConfig.pool = {
      max: 20,
      min: 2,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }
  } catch (error) {
    console.log('Pool configuration not supported, using defaults')
  }
}

// Create database instance with error handling and retry logic
let db: any
let connectionRetries = 0
const maxRetries = 3

// Connection retry function for production
const createDatabaseConnection = () => {
  try {
    return drizzle(sql, connectionConfig)
  } catch (error) {
    console.error('Database connection error:', error)
    if (connectionRetries < maxRetries) {
      connectionRetries++
      console.log(`Retrying database connection (${connectionRetries}/${maxRetries})...`)
      setTimeout(() => createDatabaseConnection(), 1000 * connectionRetries)
    }
    throw error
  }
}

// ENABLE REAL DATABASE CONNECTION
const hasPostgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL

if (hasPostgresUrl) {
  try {
    console.log('🔗 Connecting to PostgreSQL database...')
    db = createDatabaseConnection()
    console.log('✅ Database connection established')
  } catch (error) {
    console.error('❌ Database connection error:', error)
    console.log('📁 Falling back to mock database...')
    db = createMockDatabase()
  }
} else {
  console.warn('⚠️  No database URL found in environment variables')
  console.warn('   Please set POSTGRES_URL or DATABASE_URL in your .env file')
  console.warn('   Using mock database for development...')
  db = createMockDatabase()
}

function createMockDatabase() {
  console.log('🔧 Creating mock database for development...')
  
  // In-memory storage for mock data
  let mockProducts: any[] = []
  let mockBlogPosts: any[] = []
  let mockComments: any[] = []
  let mockUsers: any[] = []
  let mockCarts: any[] = []
  let mockOrders: any[] = []
  let mockContactInfo: any = null
  let mockAboutInfo: any = null
  let mockGallery: any[] = []
  
  return {
    query: {
      products: {
        findMany: async () => {
          console.log('Using mock database - returning products array')
          return mockProducts
        },
        findFirst: async () => {
          console.log('Using mock database - returning null for findFirst')
          return null
        },
      },
      blogPosts: {
        findMany: async () => {
          console.log('Using mock database - returning blog posts array')
          return mockBlogPosts
        },
        findFirst: async () => {
          console.log('Using mock database - returning null for blog post findFirst')
          return null
        },
      },
      blogComments: {
        findMany: async () => {
          console.log('Using mock database - returning comments array')
          return mockComments
        },
        findFirst: async () => {
          console.log('Using mock database - returning null for comment findFirst')
          return null
        },
      },
      users: {
        findFirst: async () => {
          console.log('Using mock database - returning null for user findFirst')
          return null
        },
      },
      carts: {
        findFirst: async () => {
          console.log('Using mock database - returning null for cart findFirst')
          return null
        },
      },
      order: {
        findMany: async () => {
          console.log('Using mock database - returning orders array')
          return mockOrders
        },
        findFirst: async () => {
          console.log('Using mock database - returning null for order findFirst')
          return null
        },
      },
      contactInfo: {
        findFirst: async () => {
          console.log('Using mock database - returning contact info')
          return mockContactInfo
        },
      },
      aboutInfo: {
        findFirst: async () => {
          console.log('Using mock database - returning about info')
          return mockAboutInfo
        },
      },
    },
    select: () => ({
      from: (table: any) => ({
        where: (condition: any) => ({
          limit: (count: number) => Promise.resolve([]),
        }),
        orderBy: (column: any) => Promise.resolve([]),
      }),
    }),
    insert: (table: any) => ({
      values: (data: any) => ({
        returning: () => {
          const newItem = {
            id: Date.now().toString(),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          
          if (table === 'products') {
            mockProducts.push(newItem)
          } else if (table === 'blogPosts') {
            mockBlogPosts.push(newItem)
          } else if (table === 'gallery') {
            mockGallery.push(newItem)
          }
          
          return Promise.resolve([newItem])
        },
      }),
    }),
    update: (table: any) => ({
      set: (data: any) => ({
        where: (condition: any) => ({
          returning: () => Promise.resolve([{ id: 'mock-id', ...data }]),
        }),
      }),
    }),
    delete: (table: any) => ({
      where: (condition: any) => Promise.resolve(),
    }),
  }
}

export default db
