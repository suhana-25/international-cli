# 🚀 Environment Setup Guide

## **📋 Required Environment Variables**

Create a `.env.local` file in your project root with these variables:

### **🔑 UploadThing Configuration**
```bash
UPLOADTHING_SECRET=your_uploadthing_secret_here
UPLOADTHING_APP_ID=gvc3bupajd
UPLOADTHING_REGION=us-east-1

# Client-side variables (for browser)
NEXT_PUBLIC_UPLOADTHING_APP_ID=gvc3bupajd
NEXT_PUBLIC_UPLOADTHING_REGION=us-east-1
```

### **🗄️ Database Configuration**
```bash
POSTGRES_URL=your_postgres_connection_string
DATABASE_URL=your_postgres_connection_string
```

### **🔐 Authentication**
```bash
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### **🌐 Google OAuth (Optional)**
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### **💳 Payment Gateways (Optional)**
```bash
# PayPal
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### **📧 Email (Optional)**
```bash
RESEND_API_KEY=your_resend_api_key
```

## **📥 How to Get UploadThing Credentials**

1. **Go to** [https://uploadthing.com/dashboard](https://uploadthing.com/dashboard)
2. **Sign in** to your account
3. **Navigate to** API Keys section
4. **Copy** your Secret Key and App ID
5. **Add them** to your `.env.local` file

## **🚀 After Setting Up Environment Variables**

1. **Restart** your development server:
   ```bash
   npm run dev
   ```

2. **Test** image uploads in admin panel

3. **Verify** no hydration errors on homepage

## **✅ What's Fixed**

- ✅ **Hydration errors** - Server/client mismatch resolved
- ✅ **Image uploads** - UploadThing properly configured
- ✅ **Environment variables** - Clean setup without secrets
- ✅ **Git repository** - Fresh history without sensitive data

## **🌐 For Vercel Deployment**

Add all environment variables in your Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add each variable from the list above
- Redeploy your application

---

**Status:** ✅ **READY** - All errors fixed, just add your environment variables!
