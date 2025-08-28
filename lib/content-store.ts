// Centralized content storage for admin-managed content
// This replaces database storage for now to avoid migration issues

import fs from 'fs'
import path from 'path'

interface ContactInfo {
  companyName: string
  address: string
  phone: string
  email: string
  website: string
  facebook: string
  instagram: string
  twitter: string
  linkedin: string
  youtube: string
}

interface AboutInfo {
  title: string
  subtitle: string
  mainContent: string
  mission: string
  vision: string
  values: string
  companyHistory: string
  teamInfo: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string
  authorId: string
  isPublished: boolean
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}

// File paths for persistence
const DATA_DIR = path.join(process.cwd(), 'data')
const BLOG_FILE = path.join(DATA_DIR, 'blogs.json')
const CONTACT_FILE = path.join(DATA_DIR, 'contact.json')
const ABOUT_FILE = path.join(DATA_DIR, 'about.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Helper function to read JSON file
function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(data, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt' || key === 'publishedAt') {
          return new Date(value)
        }
        return value
      })
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
  }
  return defaultValue
}

// Helper function to write JSON file
function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error)
  }
}

// Initialize data from files or defaults
let contactData: ContactInfo = readJsonFile(CONTACT_FILE, {
  companyName: 'Nitesh Handicraft',
  address: '123 Handicraft Street, Artisan District, Craft City, CC 12345',
  phone: '+91 7014750651',
  email: 'info@niteshhandicraft.com',
  website: 'https://www.niteshhandicraft.com',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  twitter: 'https://x.com',
  linkedin: 'https://linkedin.com/company/company',
  youtube: 'https://youtube.com/@company',
})

let aboutData: AboutInfo = readJsonFile(ABOUT_FILE, {
  title: 'About Nitesh Handicraft',
  subtitle: 'Crafting Excellence Since 1995',
  mainContent: 'Nitesh Handicraft is a leading manufacturer and supplier of high-quality handicraft products. We specialize in creating beautiful, handcrafted items that bring elegance and tradition to your home and lifestyle.',
  mission: 'To preserve traditional craftsmanship while creating modern, high-quality handicraft products that connect people with cultural heritage.',
  vision: 'To become the most trusted name in handicraft products, known for quality, authenticity, and customer satisfaction.',
  values: 'Quality, Authenticity, Customer Satisfaction, Cultural Preservation, Innovation',
  companyHistory: 'Founded in 1995, Nitesh Handicraft has been at the forefront of the handicraft industry for over 25 years. We started as a small family business and have grown into a respected name in the industry.',
  teamInfo: 'Our team consists of skilled artisans, designers, and professionals who are passionate about creating exceptional handicraft products.',
})

let blogPosts: BlogPost[] = readJsonFile(BLOG_FILE, [])

// Contact functions
export const getContactInfo = (): ContactInfo => contactData

export const updateContactInfo = (data: ContactInfo): ContactInfo => {
  contactData = { ...contactData, ...data }
  writeJsonFile(CONTACT_FILE, contactData)
  return contactData
}

// About functions
export const getAboutInfo = (): AboutInfo => aboutData

export const updateAboutInfo = (data: AboutInfo): AboutInfo => {
  aboutData = { ...aboutData, ...data }
  writeJsonFile(ABOUT_FILE, aboutData)
  return aboutData
}

// Blog functions
export const getBlogPosts = (): BlogPost[] => blogPosts

export const getBlogPostBySlug = (slug: string): BlogPost | null => {
  return blogPosts.find(post => post.slug === slug) || null
}

export const createBlogPost = (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost => {
  const newPost: BlogPost = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  blogPosts.push(newPost)
  writeJsonFile(BLOG_FILE, blogPosts)
  return newPost
}

export const updateBlogPost = (id: string, data: Partial<BlogPost>): BlogPost | null => {
  const index = blogPosts.findIndex(post => post.id === id)
  if (index === -1) return null
  
  blogPosts[index] = {
    ...blogPosts[index],
    ...data,
    updatedAt: new Date(),
  }
  writeJsonFile(BLOG_FILE, blogPosts)
  return blogPosts[index]
}

export const deleteBlogPost = (id: string): boolean => {
  const index = blogPosts.findIndex(post => post.id === id)
  if (index === -1) return false
  
  blogPosts.splice(index, 1)
  writeJsonFile(BLOG_FILE, blogPosts)
  return true
}
