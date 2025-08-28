import { NextResponse } from 'next/server'
import { getAboutInfo } from '@/lib/content-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const aboutData = getAboutInfo()
    return NextResponse.json(aboutData)
  } catch (error) {
    console.error('Error fetching about info:', error)
    // Return default data if error occurs
    return NextResponse.json({
      title: 'About Nitesh Handicraft',
      subtitle: 'Crafting Excellence Since 1995',
      mainContent: 'Nitesh Handicraft is a leading manufacturer and supplier of high-quality handicraft products. We specialize in creating beautiful, handcrafted items that bring elegance and tradition to your home and lifestyle.',
      mission: 'To preserve traditional craftsmanship while creating modern, high-quality handicraft products that connect people with cultural heritage.',
      vision: 'To become the most trusted name in handicraft products, known for quality, authenticity, and customer satisfaction.',
      values: 'Quality, Authenticity, Customer Satisfaction, Cultural Preservation, Innovation',
      companyHistory: 'Founded in 1995, Nitesh Handicraft has been at the forefront of the handicraft industry for over 25 years. We started as a small family business and have grown into a respected name in the industry.',
      teamInfo: 'Our team consists of skilled artisans, designers, and professionals who are passionate about creating exceptional handicraft products.',
    })
  }
} 

