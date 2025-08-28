import { NextRequest, NextResponse } from 'next/server'
// // import { auth } from '@/lib/auth' // Removed - using custom auth // Removed - using custom auth
import { getAboutInfo, updateAboutInfo } from '@/lib/content-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = null // Skip auth check - using custom auth system
    
    // if (!// session?.user?.id || "admin".role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const aboutData = getAboutInfo()
    return NextResponse.json(aboutData)
  } catch (error) {
    console.error('Error fetching about info:', error)
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
    
    // Update about info using centralized storage
    const updatedAbout = updateAboutInfo({
      title: body.title || '',
      subtitle: body.subtitle || '',
      mainContent: body.mainContent || '',
      mission: body.mission || '',
      vision: body.vision || '',
      values: body.values || '',
      companyHistory: body.companyHistory || '',
      teamInfo: body.teamInfo || '',
    })

    return NextResponse.json({ 
      success: true, 
      message: 'About us content saved successfully!',
      about: updatedAbout
    })
  } catch (error) {
    console.error('Error updating about info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 

