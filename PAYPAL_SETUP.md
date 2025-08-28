# PayPal Integration Setup

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_APP_SECRET=your_paypal_client_secret_here
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
```

## How to Get PayPal Keys

1. Go to https://developer.paypal.com/
2. Login to your PayPal account
3. Go to "My Apps & Credentials"
4. Create a new app or use existing app
5. Copy the Client ID and Client Secret

### Sandbox (Testing)
- Use `https://api-m.sandbox.paypal.com` for testing
- Use sandbox credentials

### Production (Live)
- Use `https://api-m.paypal.com` for live payments
- Use live credentials

## Files That Use PayPal

1. `lib/paypal.ts` - PayPal API functions
2. `app/api/payment/paypal/create-order/route.ts` - Create order API
3. `app/api/payment/paypal/capture-payment/route.ts` - Capture payment API
4. `app/(root)/payment/payment-processor.tsx` - PayPal UI component

## PayPal Flow

1. User selects PayPal payment method
2. User clicks "Place Order"
3. Redirects to `/payment?method=paypal&orderId=123`
4. PayPal buttons appear
5. User completes payment on PayPal
6. Payment captured and order marked as paid
7. User redirected to order confirmation
