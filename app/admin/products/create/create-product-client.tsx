'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { UploadButton } from '@/lib/uploadthing'

interface FormData {
  name: string
  slug: string
  description: string
  price: string
  stock: string
  weight: string
  brand: string
  categories: string
  isFeatured: boolean
  isBanner: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export default function CreateProductClient() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    weight: '',
    brand: '',
    categories: '',
    isFeatured: false,
    isBanner: false,
  })
  const [images, setImages] = useState<string[]>([])
  const [bannerImages, setBannerImages] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Auto-generate slug from product name
  useEffect(() => {
    if (formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData((prev: FormData) => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.name])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }))
  }

  const handleProductImageUpload = (uploadResponse: any) => {
    const { url } = uploadResponse[0]
    setImages((prev: string[]) => [...prev, url])
    toast({
      title: 'Success',
      description: 'Product image uploaded successfully!',
    })
  }

  const handleBannerImageUpload = (uploadResponse: any) => {
    const { url } = uploadResponse[0]
    setBannerImages((prev: string[]) => [...prev, url])
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

  const removeImage = (index: number, type: 'product' | 'banner') => {
    if (type === 'product') {
      setImages((prev: string[]) => prev.filter((_, i: number) => i !== index))
    } else {
      setBannerImages((prev: string[]) => prev.filter((_, i: number) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Basic validation
      if (!formData.name.trim()) {
        toast({
          variant: 'destructive',
          description: 'Product name is required',
        })
        setLoading(false)
        return
      }
      
      if (!formData.description.trim()) {
        toast({
          variant: 'destructive',
          description: 'Product description is required',
        })
        setLoading(false)
        return
      }
      
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast({
          variant: 'destructive',
          description: 'Valid price is required',
        })
        setLoading(false)
        return
      }
      
      if (!formData.stock || parseInt(formData.stock) < 0) {
        toast({
          variant: 'destructive',
          description: 'Valid stock quantity is required',
        })
        setLoading(false)
        return
      }

      // Process categories - split by comma and create array
      const categoriesArray = formData.categories
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat.length > 0)

      const productData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        brand: formData.brand.trim() || undefined,
        categories: categoriesArray.length > 0 ? categoriesArray : undefined,
        images: images.length > 0 ? images : undefined,
        bannerImages: bannerImages.length > 0 ? bannerImages : undefined,
        isFeatured: formData.isFeatured,
        isBanner: formData.isBanner,
      }

      // Use API route instead of server action
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          description: 'Product created successfully!',
        })
        
        // Force reload products in the store
        try {
          await fetch('/api/admin/products', { method: 'GET' })
        } catch (error) {
          console.log('Reload attempt failed, continuing...')
        }
        
        // Redirect with refresh parameter
        const refreshUrl = `/admin/products?refresh=true&t=${Date.now()}`
        router.push(refreshUrl)
      } else {
        toast({
          variant: 'destructive',
          description: result.error || 'Failed to create product. Please try again.',
        })
      }
    } catch (error) {
      console.error('Error creating product:', error)
      toast({
        variant: 'destructive',
        description: 'Failed to create product. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin/products">
            <Button className="mb-4 bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 hover:border-slate-500 font-manrope">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <h1 className="text-3xl font-poppins font-bold text-white mb-2">Create New Product</h1>
          <p className="text-slate-300 font-inter">Add a new product to your catalog</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-poppins font-semibold text-white mb-6">Product Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="name" className="text-slate-200 font-poppins font-medium">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 font-inter"
                  required
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="description" className="text-slate-200 font-poppins font-medium">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                  className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 font-inter"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-slate-200 font-poppins font-medium">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 font-inter"
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock" className="text-slate-200 font-poppins font-medium">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="0"
                  className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 font-inter"
                  required
                />
              </div>

              <div>
                <Label htmlFor="weight" className="text-slate-200 font-poppins font-medium">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="0.0"
                  className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 font-inter"
                />
              </div>

              <div>
                <Label htmlFor="brand" className="text-slate-200 font-poppins font-medium">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="Brand name"
                  className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 font-inter"
                />
              </div>

              {/* Categories */}
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="categories" className="text-slate-200 font-poppins font-medium">Categories</Label>
                <Input
                  id="categories"
                  value={formData.categories}
                  onChange={(e) => handleInputChange('categories', e.target.value)}
                  placeholder="Enter categories separated by commas (e.g. Statues, Handicrafts, Art)"
                  className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 font-inter"
                />
                <p className="text-slate-400 text-xs mt-2">
                  Admin will type category names separated by commas. These will appear on /catalog page.
                </p>
                {formData.categories && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.categories.split(',').map((cat, index) => (
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
          </div>

          {/* Images */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-poppins font-semibold text-white mb-6">Product Images</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-200 font-poppins font-medium">Product Images</Label>
                <div className="mt-2">
                  <UploadButton
                    endpoint="productImage"
                    onClientUploadComplete={handleProductImageUpload}
                    onUploadError={handleUploadError}
                    className="w-full"
                  />
                </div>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 w-6 h-6 p-0"
                        onClick={() => removeImage(index, 'product')}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Banner Images */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-poppins font-semibold text-white mb-6">Banner Images</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-200 font-poppins font-medium">Banner Images</Label>
                <div className="mt-2">
                  <UploadButton
                    endpoint="bannerImage"
                    onClientUploadComplete={handleBannerImageUpload}
                    onUploadError={handleUploadError}
                    className="w-full"
                  />
                </div>
              </div>
              {bannerImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {bannerImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 w-6 h-6 p-0"
                        onClick={() => removeImage(index, 'banner')}
                      >
                        <X className="w-3 h-3" />
                      </Button>
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
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-200 font-poppins font-medium">Featured Product</Label>
                  <p className="text-sm text-slate-400 font-inter">Show this product on homepage</p>
                </div>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-200 font-poppins font-medium">Banner Product</Label>
                  <p className="text-sm text-slate-400 font-inter">Show in banner carousel</p>
                </div>
                <Switch
                  checked={formData.isBanner}
                  onCheckedChange={(checked) => handleInputChange('isBanner', checked)}
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-manrope font-medium px-8 py-3"
            >
              {loading ? 'Creating Product...' : 'Create Product'}
            </Button>
            <Link href="/admin/products">
              <Button 
                type="button" 
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 hover:border-slate-500 font-manrope font-medium px-8 py-3"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
