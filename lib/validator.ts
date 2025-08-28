import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { products, categories, users, orders, content, blogPosts, blogComments } from '@/db/schema'

// Product schemas
export const insertProductSchema = createInsertSchema(products, {
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Product slug is required'),
  description: z.string().min(1, 'Product description is required'),
  price: z.coerce.number().positive('Price must be positive'),
  weight: z.coerce.number().positive('Weight must be positive').optional(),
  stock: z.coerce.number().int().min(0, 'Stock must be non-negative'),
  images: z.array(z.string()).optional(),
  bannerImages: z.array(z.string()).optional(),
  categoryId: z.string().optional(), // Legacy field
  // categoryIds: z.array(z.string()).optional(), // New field for multiple categories - disabled for now
  brand: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isBanner: z.boolean().default(false),
}).omit({
  id: true,
  rating: true,
  numReviews: true,
  createdAt: true,
  updatedAt: true,
})

export const updateProductSchema = createInsertSchema(products, {
  name: z.string().min(1, 'Product name is required').optional(),
  slug: z.string().min(1, 'Product slug is required').optional(),
  description: z.string().min(1, 'Product description is required').optional(),
  price: z.coerce.number().positive('Price must be positive').optional(),
  weight: z.coerce.number().positive('Weight must be positive').optional(),
  stock: z.coerce.number().int().min(0, 'Stock must be non-negative').optional(),
  images: z.array(z.string()).optional(),
  bannerImages: z.array(z.string()).optional(),
  categoryId: z.string().optional(), // Legacy field
  // categoryIds: z.array(z.string()).optional(), // New field for multiple categories - disabled for now
  brand: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isBanner: z.boolean().optional(),
})

// Category schemas
export const insertCategorySchema = createInsertSchema(categories, {
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Category slug is required'),
  description: z.string().optional(),
})

export const updateCategorySchema = createInsertSchema(categories, {
  name: z.string().min(1, 'Category name is required').optional(),
  slug: z.string().min(1, 'Category slug is required').optional(),
  description: z.string().optional(),
})

// User schemas
export const insertUserSchema = createInsertSchema(users, {
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['user', 'admin']).default('user'),
  image: z.string().optional(),
})

export const updateUserSchema = createInsertSchema(users, {
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  role: z.enum(['user', 'admin']).optional(),
  image: z.string().optional(),
})

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  image: z.string().optional(),
})

export const createAdminSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// Order schemas
export const insertOrderSchema = createInsertSchema(orders, {
  userId: z.string().min(1, 'User ID is required'),
  orderNumber: z.string().min(1, 'Order number is required'),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).default('pending'),
  totalAmount: z.coerce.number().positive('Total amount must be positive'),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).default('pending'),
  paymentMethod: z.string().optional(),
})

export const updateOrderSchema = createInsertSchema(orders, {
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  paymentMethod: z.string().optional(),
})

// Blog schemas
export const insertBlogPostSchema = createInsertSchema(blogPosts, {
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  authorId: z.string().min(1, 'Author ID is required'),
  featuredImage: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
})

export const updateBlogPostSchema = createInsertSchema(blogPosts, {
  title: z.string().min(1, 'Title is required').optional(),
  slug: z.string().min(1, 'Slug is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
})

export const insertBlogCommentSchema = createInsertSchema(blogComments, {
  postId: z.string().min(1, 'Post ID is required'),
  authorName: z.string().min(1, 'Author name is required'),
  authorEmail: z.string().email('Invalid email address'),
  content: z.string().min(1, 'Comment content is required'),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
})

// Content schemas
export const insertContentSchema = createInsertSchema(content, {
  page: z.string().min(1, 'Page is required'),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  metaDescription: z.string().optional(),
})

export const updateContentSchema = createInsertSchema(content, {
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  metaDescription: z.string().optional(),
})

// Sign up schema
export const signUpFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'admin']).default('user'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Sign in schema
export const signInFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

// About form schema
export const aboutFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  metaDescription: z.string().optional(),
})

// Shipping address schema
export const shippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email address is required'),
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone number is required'),
})

// Payment method schema
export const paymentMethodSchema = z.object({
  type: z.string().min(1, 'Payment method is required'),
})