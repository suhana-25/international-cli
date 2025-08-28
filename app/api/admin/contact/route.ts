import { NextRequest, NextResponse } from 'next/server'
// import { auth } from '@/lib/auth' // Removed - using custom auth
import { getContactInfo, updateContactInfo } from '@/lib/content-store'

export async function GET() {
  try {
    const session = null // Skip auth check - using custom auth system
    
    // if (!// session?.user?.id || "admin".role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const contactData = getContactInfo()
    return NextResponse.json(contactData)
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = null // Skip auth check - using custom auth system
    
    // if (!// session?.user?.id || "admin".role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    
    // Update contact info using centralized storage
    const updatedContact = updateContactInfo({
      companyName: body.companyName || '',
      address: body.address || '',
      phone: body.phone || '',
      email: body.email || '',
      website: body.website || '',
      facebook: body.facebook || '',
      instagram: body.instagram || '',
      twitter: body.twitter || '',
      linkedin: body.linkedin || '',
      youtube: body.youtube || '',
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Contact information saved successfully!',
      contact: updatedContact
    })
  } catch (error) {
    console.error('Error updating contact info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 

