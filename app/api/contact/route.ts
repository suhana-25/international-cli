import { NextResponse } from 'next/server'
import { getContactInfo } from '@/lib/content-store'

export async function GET() {
  try {
    const contactData = getContactInfo()
    return NextResponse.json(contactData)
  } catch (error) {
    console.error('Error fetching contact info:', error)
    // Return default data if error occurs
    return NextResponse.json({
      companyName: 'Nitesh Handicraft',
      address: '123 Art Street, Craft City, CC 12345',
      phone: '+91 7014750651',
      email: 'contact@niteshhandicraft.com',
      website: 'https://niteshhandicraft.com',
      facebook: 'https://facebook.com/niteshhandicraft',
      instagram: 'https://instagram.com/niteshhandicraft',
      twitter: 'https://twitter.com/niteshhandicraft',
      linkedin: 'https://linkedin.com/company/niteshhandicraft',
      youtube: 'https://youtube.com/@niteshhandicraft',
    })
  }
} 

