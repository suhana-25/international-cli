# 🚀 **Pusher Setup for Real-Time Sync**

## **Step 1: Create Free Pusher Account**
1. Go to [https://dashboard.pusher.com/](https://dashboard.pusher.com/)
2. Sign up for free account
3. Create a new app

## **Step 2: Get Your Credentials**
From your Pusher dashboard, copy these values:
- **App ID**
- **Key** 
- **Secret**
- **Cluster** (e.g., `mt1`, `us2`, `eu`)

## **Step 3: Add to Environment Variables**
Create `.env.local` file in your project root:

```bash
# Pusher Configuration
PUSHER_APP_ID=your_app_id_here
NEXT_PUBLIC_PUSHER_KEY=your_key_here
PUSHER_SECRET=your_secret_here
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster_here
```

## **Step 4: Deploy to Vercel**
Add these same environment variables in your Vercel project settings.

## **Free Tier Limits**
- ✅ 200,000 messages/month
- ✅ 100 concurrent connections
- ✅ Perfect for small to medium apps

## **How It Works**
1. **Admin makes change** → Product created/updated/deleted
2. **Pusher notification sent** → Real-time event triggered
3. **User pages receive notification** → Data automatically refetched
4. **UI updates instantly** → No page refresh needed

## **Channels Available**
- `products` - Product changes
- `blogs` - Blog changes  
- `gallery` - Gallery changes
- `categories` - Category changes
- `orders` - Order changes
- `users` - User changes
