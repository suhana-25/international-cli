'use client'

import slugify from 'slugify'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { createProduct, updateProduct } from '@/lib/actions/product.actions'
import { productDefaultValues } from '@/lib/constants'
import { insertProductSchema, updateProductSchema } from '@/lib/validator'
import { Product } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { UploadButton } from '@/lib/uploadthing'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export default function ProductForm({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update'
  product?: Product
  productId?: string
}) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [showCategoryInput, setShowCategoryInput] = useState(false)

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver:
      type === 'Update'
        ? zodResolver(updateProductSchema)
        : zodResolver(insertProductSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  })

  const { toast } = useToast()

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setCategories(result.data || [])
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Create new category
  const createNewCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a category name',
        variant: 'destructive'
      })
      return
    }

    setIsCreatingCategory(true)
    try {
      // Create category using the category store API
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategoryName,
          description: `Category for ${newCategoryName} products`
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Add new category to the list
          const newCategory = result.data
          setCategories(prev => [...prev, newCategory])
          
          // Set the newly created category as selected
          form.setValue('categoryId', newCategory.id)
          
          // Reset form
          setNewCategoryName('')
          setShowCategoryInput(false)
          
          toast({
            title: 'Success',
            description: 'Category created successfully'
          })
        } else {
          throw new Error(result.error || 'Failed to create category')
        }
      } else {
        throw new Error('Failed to create category')
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast({
        title: 'Error',
        description: 'Failed to create category. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsCreatingCategory(false)
    }
  }

  async function onSubmit(values: z.infer<typeof insertProductSchema>) {
    // Auto-generate slug if missing
    if (!values.slug || values.slug.trim() === '') {
      values.slug = slugify(values.name, { lower: true })
    }
    if (!values.slug || values.slug.trim() === '') {
      toast({
        variant: 'destructive',
        description: 'Product slug is required. Please enter a name.',
      })
      return
    }
    // Check for duplicate slug (client-side quick check)
    const resCheck = await fetch(`/api/product/check-slug?slug=${values.slug}`)
    const checkData = await resCheck.json()
    if (checkData.exists) {
      toast({
        variant: 'destructive',
        description: 'A product with this slug already exists. Please use a different name.',
      })
      return
    }
    console.log('onSubmit called', values)
    if (!values.images || values.images.length === 0) {
      toast({
        variant: 'destructive',
        description: 'Please upload at least one product image.',
      })
      return
    }
    // Remove banner required check
    // if (!values.banner || values.banner.trim() === '') {
    //   toast({
    //     variant: 'destructive',
    //     description: 'Please upload a banner image for this product.',
    //   })
    //   return
    // }
    try {
      if (type === 'Create') {
        const res = await createProduct(values)
        console.log('createProduct result', res)
        if (!res.success) {
          toast({
            variant: 'destructive',
            description: res.error || 'Failed to create product. Please check all fields.',
          })
          return
        } else {
          toast({
            description: 'Product successfully added and visible to customers.',
          })
          router.push(`/catalog`)
        }
      }
      if (type === 'Update') {
        if (!productId) {
          router.push(`/catalog`)
          return
        }
        const res = await updateProduct({ 
          ...values, 
          id: productId,
          description: values.description || undefined,
          weight: values.weight || undefined,
          brand: values.brand || undefined,
          images: values.images || undefined,
          bannerImages: values.bannerImages || undefined,
          categoryId: values.categoryId || undefined
        } as any)
        if (!res.success) {
          toast({
            variant: 'destructive',
            description: res.error || 'Failed to update product.',
          })
          return
        } else {
          router.push(`/catalog`)
        }
      }
    } catch (err) {
      console.error('onSubmit error', err)
      toast({
        variant: 'destructive',
        description: 'Something went wrong. Please check all fields and try again.',
      })
    }
  }
  const images = form.watch('images')
  const isFeatured = form.watch('isFeatured')
  const bannerImages = form.watch('bannerImages')
  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          toast({
            variant: 'destructive',
            description: 'Please fill all required fields correctly.',
          })
          console.error('Validation errors:', errors)
        })}
        className="space-y-8"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>

                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter product slug"
                      className="pl-8"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        form.setValue(
                          'slug',
                          slugify(form.getValues('name'), { lower: true })
                        )
                      }}
                    >
                      Generate
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <div className="space-y-3">
                  <FormControl>
                    <Select 
                      onValueChange={(value) => {
                        if (value === 'create-new') {
                          setShowCategoryInput(true)
                          field.onChange('')
                        } else {
                          setShowCategoryInput(false)
                          field.onChange(value)
                        }
                      }} 
                      value={field.value === 'create-new' ? '' : field.value || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="create-new" className="text-blue-600 font-medium">
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create New Category
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  
                  {/* Quick category creation */}
                  {(showCategoryInput || field.value === 'create-new') && (
                    <div className="border rounded-lg p-4 bg-blue-50 space-y-3">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Enter new category name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              createNewCategory()
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          onClick={createNewCategory}
                          disabled={isCreatingCategory || !newCategoryName.trim()}
                          size="sm"
                        >
                          {isCreatingCategory ? 'Creating...' : 'Create'}
                        </Button>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setShowCategoryInput(false)
                          setNewCategoryName('')
                          form.setValue('categoryId', '')
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product brand" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter product stock"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter product weight"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images <span className="text-red-500">*</span></FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images?.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt="product image"
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                        />
                      ))}
                                             <FormControl>
                         <UploadButton
                           endpoint="productImage"
                           onClientUploadComplete={(res: any) => {
                             form.setValue('images', [...(images || []), res[0].url])
                           }}
                           onUploadError={(error: Error) => {
                             toast({
                               variant: 'destructive',
                               description: `ERROR! ${error.message}`,
                             })
                           }}
                         />
                       </FormControl>
                    </div>
                  </CardContent>
                </Card>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="bannerImages"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Banner <span className="text-red-500">*</span></FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {bannerImages?.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt="banner image"
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={80}
                          height={80}
                        />
                      ))}
                    </div>
                                         <FormControl>
                       <UploadButton
                         endpoint="bannerImage"
                         onClientUploadComplete={(res) => {
                           form.setValue('bannerImages', [...(bannerImages || []), res[0].url])
                         }}
                         onUploadError={(error: Error) => {
                           toast({
                             variant: 'destructive',
                             description: `ERROR! ${error.message}`,
                           })
                         }}
                       />
                     </FormControl>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          Featured Product
          <Card>
            <CardContent className="space-y-2 mt-2  ">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="space-x-2 items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is Featured?</FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        <div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="resize-none"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting ? 'Submitting...' : `${type} Product `}
          </Button>
        </div>
      </form>
    </Form>
  )
}
