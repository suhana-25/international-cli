import { Resend } from 'resend'
import { APP_NAME } from '@/lib/constants'
import PurchaseReceiptEmail from './purchase-receipt'
import { Order } from '@/types'
import { getUserById } from '@/lib/actions/user.actions'

const resendApiKey = process.env.RESEND_API_KEY;
let resend: Resend | null = null;
if (resendApiKey) {
  resend = new Resend(resendApiKey);
}

const SENDER_EMAIL = process.env.SENDER_EMAIL || 'no-reply@example.com'

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  if (!resend) {
    return;
  }
  
  // Fetch user data separately
  const user = await getUserById(order.userId);
  if (!user) {
    console.error('User not found for order:', order.id);
    return;
  }

  const res = await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: user.email,
    subject: 'Order Confirmation',
    react: <PurchaseReceiptEmail order={order} />,
  })
  console.log(res)
}
