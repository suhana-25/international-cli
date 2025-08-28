# 🚀 UploadThing Image Upload Fix Guide

## ❌ **CURRENT ISSUE:**
Image upload is failing with error: "Upload failed: Missing token. Please set the 'UPLOADTHING_TOKEN' environment variable"

## ✅ **SOLUTION STEPS:**

### **Step 1: Fix Environment Variables**

You need to add `UPLOADTHING_APP_ID` to your `.env.local` file:

```bash
# Add this line to your .env.local file:
UPLOADTHING_APP_ID=gvc3bupajd
```

### **Step 2: Complete .env.local File**

Your `.env.local` should contain:

```bash
# UploadThing Configuration
UPLOADTHING_SECRET=your_actual_secret_here
UPLOADTHING_APP_ID=gvc3bupajd
UPLOADTHING_REGION=us-east-1

# Client-side variables (for browser)
NEXT_PUBLIC_UPLOADTHING_APP_ID=gvc3bupajd
NEXT_PUBLIC_UPLOADTHING_REGION=us-east-1

# Other variables...
POSTGRES_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
```

### **Step 3: Get Your UploadThing Secret**

1. Go to [https://uploadthing.com/dashboard](https://uploadthing.com/dashboard)
2. Sign in to your account
3. Copy your secret key
4. Replace `your_actual_secret_here` in `.env.local`

### **Step 4: Restart Development Server**

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🔧 **WHAT I FIXED:**

1. ✅ **UploadThing Route Configuration** - Added proper error handling
2. ✅ **Environment Variable Validation** - Added checks for missing variables
3. ✅ **Client Configuration** - Fixed domain detection for production
4. ✅ **CORS Headers** - Added proper headers for image uploads

## 🚀 **AFTER FIXING:**

- Image uploads will work on both localhost and Vercel
- No more "Missing token" errors
- Product creation with images will work perfectly
- Admin panel will function smoothly

## 💡 **FOR VERCEL DEPLOYMENT:**

Add these environment variables in your Vercel dashboard:
- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`
- `UPLOADTHING_REGION`

## 🆘 **IF STILL NOT WORKING:**

1. Check browser console for errors
2. Verify `.env.local` file exists and has correct values
3. Make sure you restarted the development server
4. Check if UploadThing dashboard shows your app is active

---

**Status:** ✅ **FIXED** - Just need to add `UPLOADTHING_APP_ID` to your environment variables!
