// Category types for the enhanced category store

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateCategoryInput {
  name: string
  slug: string
  description?: string | null
}

export interface UpdateCategoryInput {
  name?: string
  slug?: string
  description?: string | null
}
