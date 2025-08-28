// WhatsApp order utility for generating order messages and redirecting to WhatsApp

export interface OrderDetails {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  additionalNotes?: string
}

// WhatsApp number for admin
export const WHATSAPP_NUMBER = '+917014750651'

// Generate WhatsApp message with order details
export const generateWhatsAppMessage = (order: OrderDetails): string => {
  const itemsList = order.items
    .map(item => `• ${item.name} x${item.quantity} - ₹${item.price}`)
    .join('\n')

  const address = `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}`

  const message = `🛒 *NEW ORDER PLACED* 🛒

📋 *Order ID:* ${order.orderId}
👤 *Customer:* ${order.customerName}
📧 *Email:* ${order.customerEmail}
📱 *Phone:* ${order.customerPhone || 'Not provided'}

📍 *Shipping Address:*
${address}

🛍️ *Order Items:*
${itemsList}

💰 *Total Amount:* ₹${order.totalAmount}

${order.additionalNotes ? `📝 *Additional Notes:* ${order.additionalNotes}` : ''}

---
Please confirm this order and provide payment instructions.`

  return message
}

// Generate WhatsApp URL with pre-filled message
export const generateWhatsAppUrl = (order: OrderDetails): string => {
  const message = generateWhatsAppMessage(order)
  const encodedMessage = encodeURIComponent(message)
  
  // WhatsApp Web URL format
  return `https://wa.me/${WHATSAPP_NUMBER.replace(/\s/g, '')}?text=${encodedMessage}`
}

// Redirect to WhatsApp with order details
export const redirectToWhatsApp = (order: OrderDetails): void => {
  const whatsappUrl = generateWhatsAppUrl(order)
  
  // Open in new tab/window
  window.open(whatsappUrl, '_blank')
}

// Mobile-friendly WhatsApp redirect
export const redirectToWhatsAppMobile = (order: OrderDetails): void => {
  const whatsappUrl = generateWhatsAppUrl(order)
  
  // For mobile devices, try to open WhatsApp app
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // Try to open WhatsApp app first
    const whatsappAppUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER.replace(/\s/g, '')}&text=${encodeURIComponent(generateWhatsAppMessage(order))}`
    
    // Fallback to web if app doesn't open
    setTimeout(() => {
      window.location.href = whatsappUrl
    }, 1000)
    
    window.location.href = whatsappAppUrl
  } else {
    // Desktop - open in new tab
    window.open(whatsappUrl, '_blank')
  }
}
