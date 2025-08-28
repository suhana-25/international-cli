// Gallery types for the enhanced gallery store

export interface GalleryItem {
  id: string
  title: string | null
  description: string | null
  imageUrl: string
  fileName: string | null
  fileSize: number | null
  mimeType: string | null
  uploadedBy: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateGalleryItemInput {
  title?: string
  description?: string
  imageUrl: string
  fileName?: string
  fileSize?: number
  mimeType?: string
  uploadedBy?: string
}

export interface UpdateGalleryItemInput {
  title?: string
  description?: string
  imageUrl?: string
  fileName?: string
  fileSize?: number
  mimeType?: string
  uploadedBy?: string
}
