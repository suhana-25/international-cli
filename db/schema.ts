import { pgTable, varchar, text, real, integer, boolean, timestamp, index, uuid, decimal } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Categories table
export const categories = pgTable('categories', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Products table
export const products = pgTable('products', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  weight: real('weight'),
  stock: integer('stock').default(0),
  images: text('images').array(),
  bannerImages: text('banner_images').array(),
  categoryId: varchar('category_id', { length: 255 }).references(() => categories.id, { onDelete: 'cascade' }),
  brand: varchar('brand', { length: 255 }),
  rating: real('rating').default(0),
  numReviews: integer('num_reviews').default(0),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isBanner: boolean('is_banner').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('product_slug_idx').on(table.slug),
  categoryIdIdx: index('product_category_id_idx').on(table.categoryId),
  featuredIdx: index('product_featured_idx').on(table.isFeatured),
  bannerIdx: index('product_banner_idx').on(table.isBanner),
}))

// Users table
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  image: varchar('image', { length: 255 }),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  address: text('address'),
  paymentMethod: varchar('payment_method', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Cart table (renamed to carts to match imports)
export const carts = pgTable('carts', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 255 }).notNull(),
  productId: varchar('product_id', { length: 255 }).notNull(),
  quantity: integer('quantity').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('cart_user_id_idx').on(table.userId),
  productIdIdx: index('cart_product_id_idx').on(table.productId),
}))

// Blog posts table
export const blogPosts = pgTable('blog_posts', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  authorId: varchar('author_id', { length: 255 }).notNull(),
  featuredImage: text('featured_image'),
  status: varchar('status', { length: 50 }).default('draft').notNull(),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('blog_post_slug_idx').on(table.slug),
  authorIdIdx: index('blog_post_author_id_idx').on(table.authorId),
}))

// Blog comments table
export const blogComments = pgTable('blog_comments', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: varchar('post_id', { length: 255 }).notNull(),
  authorName: varchar('author_name', { length: 255 }).notNull(),
  authorEmail: varchar('author_email', { length: 255 }).notNull(),
  content: text('content').notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  postIdIdx: index('blog_comment_post_id_idx').on(table.postId),
}))

// Product reviews table
export const reviews = pgTable('reviews', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: varchar('product_id', { length: 255 }).notNull(),
  userName: varchar('user_name', { length: 255 }).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  isApproved: boolean('is_approved').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  productIdIdx: index('review_product_id_idx').on(table.productId),
  isApprovedIdx: index('review_is_approved_idx').on(table.isApproved),
}))

// Orders table
export const orders = pgTable('orders', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 255 }).notNull(),
  orderNumber: varchar('order_number', { length: 255 }).notNull().unique(),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  totalAmount: real('total_amount').notNull(),
  shippingAddress: text('shipping_address'),
  paymentStatus: varchar('payment_status', { length: 50 }).default('pending').notNull(),
  paymentMethod: varchar('payment_method', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('order_user_id_idx').on(table.userId),
  orderNumberIdx: index('order_number_idx').on(table.orderNumber),
}))

// Order items table
export const orderItems = pgTable('order_items', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: varchar('order_id', { length: 255 }).notNull(),
  productId: varchar('product_id', { length: 255 }).notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  orderIdIdx: index('order_item_order_id_idx').on(table.orderId),
  productIdIdx: index('order_item_product_id_idx').on(table.productId),
}))

// Content management table
export const content = pgTable('content', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  page: varchar('page', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 255 }),
  content: text('content'),
  metaDescription: varchar('meta_description', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Contact info table
export const contactInfo = pgTable('contact_info', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  phone: varchar('phone', { length: 255 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 255 }),
  facebook: varchar('facebook', { length: 255 }),
  instagram: varchar('instagram', { length: 255 }),
  twitter: varchar('twitter', { length: 255 }),
  linkedin: varchar('linkedin', { length: 255 }),
  youtube: varchar('youtube', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Relations
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  reviews: many(reviews),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

export const usersRelations = relations(users, ({ many }) => ({
  cart: many(carts),
  orders: many(orders),
  blogPosts: many(blogPosts),
}))

export const cartsRelations = relations(carts, ({ one }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [carts.productId],
    references: [products.id],
  }),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}))

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
  comments: many(blogComments),
}))

export const blogCommentsRelations = relations(blogComments, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogComments.postId],
    references: [blogPosts.id],
  }),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))

export const chatSessions = pgTable('chat_sessions', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 255 }).notNull(),
  userName: varchar('user_name', { length: 255 }).notNull(),
  userEmail: varchar('user_email', { length: 255 }),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 45 }),
  status: varchar('status', { length: 50 }).default('active').notNull(), // active, inactive, closed, archived
  lastActivity: timestamp('last_activity').defaultNow().notNull(),
  lastSeen: timestamp('last_seen'),
  isOnline: boolean('is_online').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('chat_session_user_id_idx').on(table.userId),
  statusIdx: index('chat_session_status_idx').on(table.status),
  isOnlineIdx: index('chat_session_is_online_idx').on(table.isOnline),
}))

export const chatMessages = pgTable('chat_messages', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionId: varchar('session_id', { length: 255 }).notNull().references(() => chatSessions.id, { onDelete: 'cascade' }),
  senderType: varchar('sender_type', { length: 50 }).notNull(), // 'user' or 'admin'
  senderId: varchar('sender_id', { length: 255 }).notNull(),
  senderName: varchar('sender_name', { length: 255 }).notNull(),
  message: text('message').notNull(),
  messageType: varchar('message_type', { length: 50 }).default('text').notNull(), // text, image, file
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  sessionIdIdx: index('chat_message_session_id_idx').on(table.sessionId),
  senderTypeIdx: index('chat_message_sender_type_idx').on(table.senderType),
  createdAtIdx: index('chat_message_created_at_idx').on(table.createdAt),
}))

export const chatTypingIndicators = pgTable('chat_typing_indicators', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionId: varchar('session_id', { length: 255 }).notNull().references(() => chatSessions.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 }).notNull(),
  userName: varchar('user_name', { length: 255 }).notNull(),
  isTyping: boolean('is_typing').default(false).notNull(),
  lastTyping: timestamp('last_typing').defaultNow().notNull(),
}, (table) => ({
  sessionIdIdx: index('chat_typing_session_id_idx').on(table.sessionId),
  userIdIdx: index('chat_typing_user_id_idx').on(table.userId),
}))

// Gallery table (supports both images and videos)
export const gallery = pgTable('gallery', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar('title', { length: 255 }),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }).notNull(), // Can be image or video URL
  fileName: varchar('file_name', { length: 255 }),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  // mediaType: varchar('media_type', { length: 20 }).default('image').notNull(), // Removed - not in DB
  uploadedBy: varchar('uploaded_by', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  uploadedByIdx: index('gallery_uploaded_by_idx').on(table.uploadedBy),
}))

// Contact messages table
export const contactMessages = pgTable('contact_messages', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('unread').notNull(), // unread, read, replied
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  statusIdx: index('contact_messages_status_idx').on(table.status),
  createdAtIdx: index('contact_messages_created_at_idx').on(table.createdAt),
}))
