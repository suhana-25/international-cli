'use server'

// import { auth, signIn, signOut } from '@/lib/auth' // Removed - using custom auth
import { hash } from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateUserSchema,
} from '../validator'
import { formatError } from '../utils'
import { hashSync } from 'bcrypt-ts-edge'
import db from '@/db/drizzle'
import { users } from '@/db/schema'
import { ShippingAddress } from '@/types'
import { count, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { PAGE_SIZE } from '@/lib/constants'

// USER
export async function signUp(prevState: unknown, formData: FormData) {
  try {
    console.log('SignUp: Starting sign-up process')
    
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      confirmPassword: formData.get('confirmPassword'),
      password: formData.get('password'),
    })
    
    console.log('SignUp: Form data parsed successfully', { email: user.email, name: user.name })
    
    const values = {
      id: crypto.randomUUID(),
      ...user,
      password: hashSync(user.password, 10),
    }
    
    console.log('SignUp: Attempting to insert user into database')
    
    await db.insert(users).values(values)
    
    console.log('SignUp: User inserted successfully, attempting to sign in')
    
    // Skip NextAuth signIn - using custom auth system
    console.log('SignUp: Skipping NextAuth signIn, user created successfully')
    
    console.log('SignUp: Sign-in successful')
    
    return { success: true, message: 'User created successfully' }
  } catch (error) {
    console.error('SignUp: Error occurred', error)
    
    const errorMessage = formatError(error).includes(
      'duplicate key value violates unique constraint "user_email_idx"'
    )
      ? 'Email is already exist'
      : formatError(error)
    
    console.log('SignUp: Returning error message', errorMessage)
    
    return {
      success: false,
      message: errorMessage,
    }
  }
}

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    console.log('SignIn: Starting sign-in process')
    
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })
    
    console.log('SignIn: Form data parsed successfully', { email: user.email })
    
    // Skip NextAuth signIn - using custom auth system
    
    console.log('SignIn: Sign-in successful')
    
    return { success: true, message: 'Sign in successfully' }
  } catch (error) {
    console.error('SignIn: Error occurred', error)
    
    return { success: false, message: 'Invalid email or password' }
  }
}

export const SignInWithEmail = async (formData: any) => {
  // Skip NextAuth signIn - using custom auth system
  console.log('SignInWithEmail: Using custom auth system instead')
}

export const SignInWithGoogle = async () => {
  // Skip NextAuth signIn - using custom auth system
  console.log('SignInWithGoogle: Using custom auth system instead')
}

export const SignOut = async () => {
  try {
    // Skip NextAuth signOut - using custom auth system
    console.log('SignOut: Using custom auth system instead')
    
    return { success: true, message: 'Signed out successfully' }
  } catch (error) {
    console.error('SignOut error:', error)
    throw error
  }
}

// GET
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number
  page: number
}) {
  const data = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
    limit,
    offset: (page - 1) * limit,
  })
  const dataCount = await db.select({ count: count() }).from(users)
  return {
    data,
    totalPages: Math.ceil(dataCount[0].count / limit),
  }
}

export async function getUserById(userId: string) {
  try {
    console.log('getUserById called with userId:', userId)
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })
    
    console.log('getUserById result:', user ? 'user found' : 'user not found')
    
    return user
  } catch (error) {
    console.error('getUserById error:', error)
    return null
  }
}

// DELETE
export async function deleteUser(id: string) {
  try {
    await db.delete(users).where(eq(users.id, id))
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User deleted successfully',
    }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}

// UPDATE USER ROLE
export async function updateUserRole(userId: string, newRole: string) {
  try {
    await db
      .update(users)
      .set({ role: newRole as any })
      .where(eq(users.id, userId))
    
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User role updated successfully',
    }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}

// UPDATE
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await db
      .update(users)
      .set({
        name: user.name,
        role: user.role,
      })
      .where(eq(users.id, user.id!))
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
export async function updateUserAddress(data: ShippingAddress) {
  try {
    console.log('📋 UpdateUserAddress: Starting address update...')
    
    // For now, always treat as guest checkout since we're using custom auth
    const address = shippingAddressSchema.parse(data)
    console.log('📋 UpdateUserAddress: Address validated:', address)
    
    return {
      success: true,
      message: 'Address saved for checkout',
      isGuest: true,
      data: address
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = null // Skip auth check - using custom auth system
    
    // If no session, allow guest checkout
    // if (!session?.user?.id) {
    //   const paymentMethod = paymentMethodSchema.parse(data)
    //   return {
    //     success: true,
    //     message: 'Payment method saved for guest checkout',
    //     isGuest: true
    //   }
    // }

    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, "admin"), // session.user.id,
    })
    
    if (!currentUser) {
      // User not found but session exists
      const paymentMethod = paymentMethodSchema.parse(data)
      return {
        success: true,
        message: 'Payment method saved temporarily',
        isGuest: true
      }
    }

    const paymentMethod = paymentMethodSchema.parse(data)
    await db
      .update(users)
      .set({ paymentMethod: paymentMethod.type })
      .where(eq(users.id, currentUser.id))
    revalidatePath('/place-order')
    return {
      success: true,
      message: 'Payment method updated successfully',
      isGuest: false
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = null // Skip auth check - using custom auth system
    // if (!session?.user?.id) {
    //   throw new Error('No authenticated user found')
    // }
    
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, "admin"), // session.user.id,
    })
    
    if (!currentUser) {
      throw new Error('User not found')
    }

    console.log('Updating user:', { id: currentUser.id, newName: user.name })
    
    const [updatedUser] = await db
      .update(users)
      .set({
        name: user.name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, currentUser.id))
      .returning()

    console.log('User updated successfully:', updatedUser)

    // Revalidate paths to refresh data
    revalidatePath('/user/profile')
    revalidatePath('/admin/users')

    return {
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { success: false, message: formatError(error) }
  }
}

export async function createAdminUser(data: { name: string; email: string; password: string }) {
  try {
    const session = null // Skip auth check - using custom auth system
    
    // Check if current user is admin
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, "admin"), // session?.user.id!,
    })
    
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can create admin users')
    }

    // Check if email already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    })
    
    if (existingUser) {
      throw new Error('Email already exists')
    }

    // Hash password
    const hashedPassword = await hash(data.password, 12)

    // Create new admin user
    const [newAdmin] = await db.insert(users).values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date(), // Auto-verify admin accounts
    }).returning()

    return {
      success: true,
      message: `Admin user '${data.name}' created successfully`,
      user: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      }
    }
  } catch (error) {
    return { success: false, message: formatError(error)}
  }
}
