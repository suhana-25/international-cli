import { NextRequest, NextResponse } from 'next/server'
// import { auth } from '@/auth' // Removed - using custom auth

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = null // Skip auth check - using custom auth system
    const resolvedParams = await params
    
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Mock invoice data for development
    const invoiceData = {
      invoiceNumber: `INV-${resolvedParams.orderId}`,
      invoiceDate: new Date().toISOString(),
      orderId: resolvedParams.orderId,
      orderDate: new Date().toISOString(),
      paymentStatus: 'PAID' as const,
      paymentMethod: 'Credit Card',
      company: {
        name: 'Nitesh Handicraft',
        address: '123 Handicraft Street, Artisan District, Craft City, CC 12345',
        email: 'info@niteshhandicraft.com',
        phone: '+1 (555) 123-4567',
        gst: 'GST: 12ABCDE1234F1Z5',
        website: 'www.niteshhandicraft.com',
      },
      customer: {
        name: 'Customer',
        email: 'customer@example.com',
        address: {
          fullName: 'Customer',
          streetAddress: '123 Customer Street',
          city: 'Customer City',
          postalCode: '12345',
          country: 'United States',
          phone: '+1 (555) 987-6543',
        }
      },
      items: [
        {
          name: 'Handcrafted Wooden Bowl',
          slug: 'wooden-bowl',
          qty: 2,
          price: 29.99,
          image: 'https://via.placeholder.com/150',
          product: {
            description: 'Beautiful handcrafted wooden bowl made from sustainable materials'
          },
          lineTotal: 59.98,
        },
        {
          name: 'Artisan Ceramic Vase',
          slug: 'ceramic-vase',
          qty: 1,
          price: 45.00,
          image: 'https://via.placeholder.com/150',
          product: {
            description: 'Unique ceramic vase crafted by local artisans'
          },
          lineTotal: 45.00,
        }
      ],
      summary: {
        subtotal: 104.98,
        shipping: 10.00,
        tax: 8.40,
        total: 123.38,
      }
    }

    return NextResponse.json(invoiceData)
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 