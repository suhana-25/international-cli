'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { insertProductSchema } from '@/lib/validator'
import type { z } from 'zod'
import { UploadButton } from '@/lib/uploadthing'

type ProductFormData = z.infer<typeof insertProductSchema>

export default function EditProductPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [categoriesString, setCategoriesString] = useState('')
  
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const productId = params?.id as string

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      images: [],
      bannerImages: [],
      isFeatured: false,
      isBanner: false,
    }
  })

  const watchedImages = watch('images') || []
  const watchedBannerImages = watch('bannerImages') || []

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
          const product = result.data.find((p: any) => p.id === productId)
          
          if (!product) {
            setError('Product not found')
            return
          }

          // Populate form with product data
          setValue('name', product.name)
          setValue('slug', product.slug)
          setValue('description', product.description || '')
          setValue('price', product.price)
          setValue('weight', product.weight || 0)
          setValue('stock', product.stock)
          setValue('brand', product.brand || '')
          setValue('images', product.images || [])
          setValue('bannerImages', product.bannerImages || [])
          setValue('isFeatured', product.isFeatured)
          setValue('isBanner', product.isBanner)
          
          // Populate categories string - convert category IDs to names
          if (product.categoryIds && product.categoryIds.length > 0) {
            // For now, just set empty string - we'll need to fetch category names
            // This is a simplified approach for the edit form
            setCategoriesString('Edit categories here...')
          } else {
            setCategoriesString('')
          }
          
        } else {
          setError(result.error || 'Failed to fetch product')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, setValue])

  const handleProductImageUpload = (uploadResponse: any) => {
    const { url } = uploadResponse[0]
    const updatedImages = [...watchedImages, url]
    setValue('images', updatedImages)
    toast({
      title: 'Success',
      description: 'Product image uploaded successfully!',
    })
  }

  const handleBannerImageUpload = (uploadResponse: any) => {
    const { url } = uploadResponse[0]
    const updatedImages = [...watchedBannerImages, url]
    setValue('bannerImages', updatedImages)
    toast({
      title: 'Success',
      description: 'Banner image uploaded successfully!',
    })
  }

  const handleUploadError = (error: Error) => {
    toast({
      title: 'Error',
      description: `Upload failed: ${error.message}`,
      variant: 'destructive'
    })
  }

  const removeImage = (index: number, type: 'images' | 'bannerImages') => {
    const currentImages = type === 'images' ? watchedImages : watchedBannerImages
    const updatedImages = currentImages.filter((_, i) => i !== index)
    setValue(type, updatedImages)
  }

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true)
    
    try {
      // Process categories - split by comma and create array
      const categoriesArray = categoriesString
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat.length > 0)

      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: productId,
          ...data,
          categories: categoriesArray.length > 0 ? categoriesArray : undefined,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          description: 'Product updated successfully!',
        })
        
        // Redirect back to products list with refresh parameter
        router.push(`/admin/products?refresh=true&t=${Date.now()}`)
        
        // Aggressive refresh to ensure data is updated
        setTimeout(() => {
          window.location.href = `/admin/products?refresh=true&t=${Date.now()}`
        }, 100)
        
      } else {
        throw new Error(result.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        variant: 'destructive',
        description: error instanceof Error ? error.message : 'Failed to update product',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <h3 className="text-xl font-poppins font-semibold text-white mb-2">Loading Product...</h3>
              <p className="text-slate-400 font-inter">Please wait while we fetch product details</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/admin/products">
              <Button variant="ghost" className="text-slate-300 hover:text-white font-manrope">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-xl font-poppins font-semibold text-white mb-2">Error</h2>
              <p className="text-red-400 font-inter mb-6">{error}</p>
              <Link href="/admin/products">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-manrope font-medium">
                  Back to Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/products">
            <Button variant="ghost" className="text-slate-300 hover:text-white font-manrope mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <h1 className="text-3xl font-poppins font-bold text-white mb-2">Edit Product</h1>
          <p className="text-slate-300 font-inter">Update product information and settings</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-poppins font-semibold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-manrope font-medium text-slate-200 mb-2">
                  Product Name
                </label>
                <Input
                  {...register('name')}
                  placeholder="Enter product name"
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 font-inter"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1 font-inter">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-slate-200 mb-2">
                  Slug
                </label>
                <Input
                  {...register('slug')}
                  placeholder="product-slug"
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 font-inter"
                />
                {errors.slug && (
                  <p className="text-red-400 text-sm mt-1 font-inter">{errors.slug.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-slate-200 mb-2">
                  Price ($)
                </label>
                <Input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 font-inter"
                />
                {errors.price && (
                  <p className="text-red-400 text-sm mt-1 font-inter">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-slate-200 mb-2">
                  Stock Quantity
                </label>
                <Input
                  {...register('stock', { valueAsNumber: true })}
                  type="number"
                  placeholder="0"
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 font-inter"
                />
                {errors.stock && (
                  <p className="text-red-400 text-sm mt-1 font-inter">{errors.stock.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-slate-200 mb-2">
                  Weight (kg)
                </label>
                <Input
                  {...register('weight', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 font-inter"
                />
                {errors.weight && (
                  <p className="text-red-400 text-sm mt-1 font-inter">{errors.weight.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-slate-200 mb-2">
                  Brand
                </label>
                <Input
                  {...register('brand')}
                  placeholder="Brand name"
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 font-inter"
                />
                {errors.brand && (
                  <p className="text-red-400 text-sm mt-1 font-inter">{errors.brand.message}</p>
                )}
              </div>

              {/* Categories */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-manrope font-medium text-slate-200 mb-2">
                  Categories
                </label>
                <Input
                  value={categoriesString}
                  onChange={(e) => setCategoriesString(e.target.value)}
                  placeholder="Enter categories separated by commas (e.g. Statues, Handicrafts, Art)"
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 font-inter"
                />
                <p className="text-slate-400 text-xs mt-2">
                  Type category names separated by commas. These will appear on /catalog page.
                </p>
                {categoriesString && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {categoriesString.split(',').map((cat, index) => (
                      cat.trim() && (
                        <span
                          key={index}
                          className="bg-blue-900/30 border border-blue-700 text-blue-200 px-2 py-1 rounded text-xs font-inter"
                        >
                          {cat.trim()}
                        </span>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-manrope font-medium text-slate-200 mb-2">
                Description
              </label>
              <Textarea
                {...register('description')}
                placeholder="Enter product description"
                rows={4}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 font-inter"
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1 font-inter">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-poppins font-semibold text-white mb-6">Product Images</h2>
            
            <div>
              <label className="block text-sm font-manrope font-medium text-slate-200 mb-2">
                Upload Images
              </label>
              <div className="mt-2">
                <UploadButton
                  endpoint="productImage"
                  onClientUploadComplete={handleProductImageUpload}
                  onUploadError={handleUploadError}
                  className="w-full"
                />
              </div>
              
              {/* Display current images */}
              {watchedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {watchedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, 'images')}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Banner Images */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-poppins font-semibold text-white mb-6">Banner Images</h2>
            
            <div>
              <label className="block text-sm font-manrope font-medium text-slate-200 mb-2">
                Upload Banner Images
              </label>
              <div className="mt-2">
                <UploadButton
                  endpoint="bannerImage"
                  onClientUploadComplete={handleBannerImageUpload}
                  onUploadError={handleUploadError}
                  className="w-full"
                />
              </div>
              
              {/* Display current banner images */}
              {watchedBannerImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {watchedBannerImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, 'bannerImages')}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-poppins font-semibold text-white mb-6">Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  {...register('isFeatured')}
                  checked={watch('isFeatured')}
                  onCheckedChange={(checked) => setValue('isFeatured', !!checked)}
                  className="border-slate-600 data-[state=checked]:bg-blue-600"
                />
                <label
                  htmlFor="isFeatured"
                  className="text-sm font-manrope font-medium text-slate-200 cursor-pointer"
                >
                  Featured Product (appears in featured section)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isBanner"
                  {...register('isBanner')}
                  checked={watch('isBanner')}
                  onCheckedChange={(checked) => setValue('isBanner', !!checked)}
                  className="border-slate-600 data-[state=checked]:bg-blue-600"
                />
                <label
                  htmlFor="isBanner"
                  className="text-sm font-manrope font-medium text-slate-200 cursor-pointer"
                >
                  Banner Product (appears in banner carousel)
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/products">
              <Button 
                type="button" 
                variant="ghost" 
                className="text-slate-300 hover:text-white font-manrope"
              >
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-manrope font-medium min-w-[120px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 