// Simple gallery storage for admin-managed gallery items
// Direct file operations without complex sync for reliability
// Now with real-time notifications via Pusher

import fs from 'fs'
import path from 'path'
import { notifyGalleryChange } from './pusher'

export interface GalleryItem {
  id: string
  title: string
  description: string | null
  imageUrl: string
  category: string | null
  tags: string[] | null
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

// File-based storage path
const STORAGE_PATH = path.join(process.cwd(), 'data', 'gallery.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true, mode: 0o755 })
      console.log('✅ Data directory created successfully')
    } catch (error) {
      console.error('❌ Error creating data directory:', error)
    }
  }
}

// Simple file operations
const readGalleryFile = (): GalleryItem[] => {
  try {
    ensureDataDir()
    if (fs.existsSync(STORAGE_PATH)) {
      const data = fs.readFileSync(STORAGE_PATH, 'utf8')
      const items = JSON.parse(data)
      // Parse dates
      return items.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }))
    }
  } catch (error) {
    console.error('❌ Error reading gallery file:', error)
  }
  return []
}

const writeGalleryFile = (items: GalleryItem[]): boolean => {
  try {
    ensureDataDir()
    
    // Create backup before writing
    if (fs.existsSync(STORAGE_PATH)) {
      const backupPath = STORAGE_PATH + '.backup'
      fs.copyFileSync(STORAGE_PATH, backupPath)
    }
    
    // Write with atomic operation
    const tempPath = STORAGE_PATH + '.tmp'
    fs.writeFileSync(tempPath, JSON.stringify(items, null, 2))
    fs.renameSync(tempPath, STORAGE_PATH)
    
    console.log(`✅ Gallery items saved successfully: ${items.length} items`)
    return true
  } catch (error) {
    console.error('❌ Error saving gallery items:', error)
    return false
  }
}

// In-memory storage
let galleryItems: GalleryItem[] = readGalleryFile()

// Force reload gallery from file
export const reloadGalleryItems = (): GalleryItem[] => {
  console.log('🔄 Force reloading gallery items from file...')
  galleryItems = readGalleryFile()
  console.log(`✅ Reloaded ${galleryItems.length} gallery items`)
  return galleryItems
}

// Gallery functions
export const getGalleryItems = (): GalleryItem[] => {
  // Always get fresh data from file
  galleryItems = readGalleryFile()
  return galleryItems
}

export const getGalleryItemById = (id: string): GalleryItem | null => {
  const freshItems = readGalleryFile()
  return freshItems.find(item => item.id === id) || null
}

export const getFeaturedGalleryItems = (limit: number = 6): GalleryItem[] => {
  const freshItems = readGalleryFile()
  const featured = freshItems
    .filter(item => item.isFeatured)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
  return featured
}

export const createGalleryItem = async (data: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<GalleryItem> => {
  // Get fresh data
  galleryItems = readGalleryFile()
  
  const newItem: GalleryItem = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  galleryItems.push(newItem)
  
  // Save to file
  if (writeGalleryFile(galleryItems)) {
    console.log(`✅ Gallery item created: ${newItem.title} (ID: ${newItem.id})`)
    console.log(`🖼️ Total gallery items after creation: ${galleryItems.length}`)
    
    // Send real-time notification
    try {
      await notifyGalleryChange('created', newItem)
      console.log('📡 Real-time: Gallery item creation notification sent')
    } catch (error) {
      console.error('❌ Real-time: Failed to send gallery item creation notification:', error)
    }
  } else {
    console.error('❌ Failed to save gallery item to file')
  }
  
  return newItem
}

export const updateGalleryItem = async (id: string, data: Partial<GalleryItem>): Promise<GalleryItem | null> => {
  galleryItems = readGalleryFile()
  const index = galleryItems.findIndex(item => item.id === id)
  if (index === -1) return null
  
  galleryItems[index] = {
    ...galleryItems[index],
    ...data,
    updatedAt: new Date(),
  }
  
  if (writeGalleryFile(galleryItems)) {
    console.log(`✅ Gallery item updated: ${galleryItems[index].title}`)
    
    // Send real-time notification
    try {
      await notifyGalleryChange('updated', galleryItems[index])
      console.log('📡 Real-time: Gallery item update notification sent')
    } catch (error) {
      console.error('❌ Real-time: Failed to send gallery item update notification:', error)
    }
  }
  
  return galleryItems[index]
}

export const deleteGalleryItem = async (id: string): Promise<boolean> => {
  try {
    console.log(`🔍 Attempting to delete gallery item with ID: ${id}`)
    
    // Get fresh data
    galleryItems = readGalleryFile()
    console.log(`🖼️ Current gallery items: ${galleryItems.length}`)
    
    const index = galleryItems.findIndex(item => item.id === id)
    if (index === -1) {
      console.log(`❌ Gallery item with ID ${id} not found`)
      return false
    }
    
    console.log(`🗑️ Found gallery item at index ${index}, deleting...`)
    const deletedItem = galleryItems[index]
    galleryItems.splice(index, 1)
    
    // Save to file
    if (writeGalleryFile(galleryItems)) {
      console.log(`✅ Gallery item deleted: ${deletedItem.title}`)
      console.log(`🖼️ Remaining gallery items: ${galleryItems.length}`)
      
      // Send real-time notification
      try {
        await notifyGalleryChange('deleted', deletedItem)
        console.log('📡 Real-time: Gallery item deletion notification sent')
      } catch (error) {
        console.error('❌ Real-time: Failed to send gallery item deletion notification:', error)
      }
      
      return true
    } else {
      console.error('❌ Failed to save after deletion')
      return false
    }
    
  } catch (error) {
    console.error(`❌ Error in deleteGalleryItem for ID ${id}:`, error)
    return false
  }
}
