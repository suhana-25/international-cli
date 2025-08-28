# 🚀 Production Deployment Guide - Nitesh Handicraft

## 🔧 **Environment Variables Required for Production**

### **Essential Variables (Must Have):**

```env
# Node Environment
NODE_ENV=production

# Database (PostgreSQL)
POSTGRES_URL=postgresql://username:password@host:port/database?sslmode=require

# NextAuth Authentication (CRITICAL)
NEXTAUTH_SECRET=your-super-long-random-secret-key-minimum-32-characters
NEXTAUTH_URL=https://yourdomain.com
AUTH_SECRET=your-super-long-random-secret-key-minimum-32-characters

# UploadThing (for image uploads)
UPLOADTHING_SECRET=sk_live_your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

### **Optional Variables (For Extended Features):**

```env
# Google OAuth (for Google sign-in)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# PayPal (for payments)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Email (for notifications)
RESEND_API_KEY=your_resend_api_key

# WebSocket (for chat)
WEBSOCKET_URL=wss://yourdomain.com

# Security
CORS_ORIGIN=https://yourdomain.com
```

## 🎯 **Quick Fix for SignIn Error**

### **Generate Strong Secrets:**

1. **NEXTAUTH_SECRET & AUTH_SECRET**:
   ```bash
   # Generate a strong secret (use same value for both)
   openssl rand -base64 32
   ```

2. **Set Production URL**:
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   ```

## 🔗 **Platform-Specific Setup**

### **Vercel Deployment:**

1. **Add Environment Variables in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add all required variables above

2. **Essential Vercel Settings:**
   ```env
   NODE_ENV=production
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=generated-secret-from-openssl
   AUTH_SECRET=same-as-nextauth-secret
   POSTGRES_URL=your-database-url
   ```

### **Netlify Deployment:**

1. **Add Environment Variables in Netlify:**
   - Site Settings → Environment Variables
   - Add all required variables

2. **Build Settings:**
   ```bash
   Build command: npm run build
   Publish directory: .next
   ```

### **Railway/Render Deployment:**

1. **Add Environment Variables in Dashboard**
2. **Ensure DATABASE_URL is set correctly**

## ⚠️ **Common SignIn Errors & Fixes**

### **Error: "Configuration"**
```env
# Fix: Ensure these are set
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://your-actual-domain.com
```

### **Error: "Missing Secret"**
```env
# Fix: Add both secrets (use same value)
NEXTAUTH_SECRET=your-secret
AUTH_SECRET=your-secret
```

### **Error: "Callback URL Mismatch"**
```env
# Fix: Match your domain exactly
NEXTAUTH_URL=https://yourdomain.com
# NOT: http://yourdomain.com (wrong protocol)
# NOT: https://yourdomain.com/ (trailing slash)
```

## 🧪 **Test Your Configuration**

### **Local Testing:**
```bash
# 1. Copy environment template
cp .env.example .env.local

# 2. Fill in your values
# 3. Test locally
npm run dev

# 4. Test production build
npm run build
npm start
```

### **Production Testing:**
1. ✅ SignIn/SignOut works
2. ✅ Admin access works (`/admin`)
3. ✅ Database queries work
4. ✅ File uploads work (if using UploadThing)
5. ✅ Image display works

## 🚀 **Admin Access After Deployment**

### **Default Admin Credentials:**
- **URL**: `https://yourdomain.com/admin`
- **Email**: `admin@niteshhandicraft.com`
- **Password**: `nitesh121321421`

### **If Admin SignIn Fails:**
1. Check environment variables are set
2. Verify database connection
3. Ensure NEXTAUTH_URL matches your domain exactly
4. Check browser console for specific errors

## 🔧 **Database Migration After Deployment**

If you need to reset/setup the database:
```bash
# Run migrations
npm run db:push

# Or manually create admin user via API
POST /api/auth/signup
{
  "name": "Admin",
  "email": "admin@niteshhandicraft.com", 
  "password": "nitesh121321421",
  "role": "admin"
}
```

## 📞 **Troubleshooting**

### **Still Getting SignIn Errors?**
1. **Check Environment Variables**: Ensure all required vars are set
2. **Verify Domain**: NEXTAUTH_URL must match your actual domain
3. **Check Database**: Ensure user exists in database
4. **Browser Console**: Check for specific error messages
5. **Redeploy**: Sometimes requires a fresh deployment

### **Need Help?**
- Verify environment variables are exactly as shown above
- Ensure no trailing spaces in environment values
- Use HTTPS (not HTTP) for production NEXTAUTH_URL
- Generate fresh secrets with openssl command

---

## ✅ **Deployment Checklist**

- [ ] All environment variables set
- [ ] NEXTAUTH_SECRET generated and set
- [ ] NEXTAUTH_URL matches domain exactly
- [ ] Database URL is correct
- [ ] Build completes successfully
- [ ] Admin login works
- [ ] Category management works
- [ ] Product creation works

**Your Nitesh Handicraft store is ready for production! 🎉**
