import { NextRequest, NextResponse } from 'next/server'
import { 
  getAdminUsers, 
  createAdminUser, 
  deleteAdminUser, 
  reloadAdminUsers 
} from '@/lib/admin-store'

export async function GET() {
  try {
    console.log('👥 Admin Management API: Fetching all admin users...')
    
    // Force reload admin users from file
    reloadAdminUsers()
    const admins = getAdminUsers()
    
    // Return admin data without passwords
    const adminData = admins.map(admin => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      created_at: admin.created_at.toISOString()
    }))
    
    console.log(`✅ Admin Management API: Found ${admins.length} admin users`)
    
    return NextResponse.json({ admins: adminData })
  } catch (error) {
    console.error('❌ Error fetching admin users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) { 
  try {
    console.log('👥 Admin Management API: Processing admin management request...')
    
    const body = await request.json()
    const { action, adminData } = body

    if (action === 'add') {
      console.log('➕ Adding new admin user:', { name: adminData.name, email: adminData.email })
      
      try {
        const newAdmin = await createAdminUser({
          name: adminData.name,
          email: adminData.email,
          password: adminData.password,
          role: 'admin'
        })
        
        console.log('✅ Admin user created successfully:', newAdmin.id)
        
        return NextResponse.json({ 
          success: true, 
          message: 'Admin user created successfully',
          admin: {
            id: newAdmin.id,
            name: newAdmin.name,
            email: newAdmin.email,
            role: newAdmin.role,
            created_at: newAdmin.created_at.toISOString()
          }
        })
      } catch (error) {
        console.error('❌ Error creating admin user:', error)
        return NextResponse.json({ 
          error: error instanceof Error ? error.message : 'Failed to create admin user' 
        }, { status: 400 })
      }
    }

    if (action === 'delete') {
      console.log('🗑️ Deleting admin user:', adminData.adminId)
      
      const success = deleteAdminUser(adminData.adminId)
      
      if (success) {
        console.log('✅ Admin user deleted successfully')
        return NextResponse.json({ 
          success: true, 
          message: 'Admin user deleted successfully' 
        })
      } else {
        console.log('❌ Failed to delete admin user')
        return NextResponse.json({ 
          error: 'Failed to delete admin user. Cannot delete the last admin user.' 
        }, { status: 400 })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('❌ Error managing admin users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}