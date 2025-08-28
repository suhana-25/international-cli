# Deployment Steps for Nitesh Handicraft

## GitHub Setup (Manual Steps Required)

1. **Create Personal Access Token on GitHub:**
   - Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with repo permissions
   - Copy the token

2. **Configure Git with Token:**
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/suhana-25/international-cli.git
   ```

3. **Push to GitHub:**
   ```bash
   git push origin master
   ```

## Render Deployment

1. **Go to [render.com](https://render.com)**
2. **Sign up/Login with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository:**
   - Select `suhana-25/international-cli`
   - Choose the branch (master)

5. **Configure the service:**
   - **Name:** `nitesh-handicraft`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Starter (Free)

6. **Add Environment Variables:**
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your database connection string
   - `NEXTAUTH_SECRET`: Random secret string
   - `NEXTAUTH_URL`: `https://your-app-name.onrender.com`
   - `PUSHER_APP_ID`: Your Pusher app ID
   - `PUSHER_KEY`: Your Pusher key
   - `PUSHER_SECRET`: Your Pusher secret
   - `UPLOADTHING_SECRET`: Your UploadThing secret
   - `UPLOADTHING_APP_ID`: Your UploadThing app ID

7. **Click "Create Web Service"**

## Alternative: Manual File Upload

If GitHub push fails, you can manually upload files to the repository through GitHub web interface:

1. Go to `https://github.com/suhana-25/international-cli`
2. Click "Add file" → "Upload files"
3. Drag and drop all project files
4. Commit changes

## Database Setup

Ensure your database is accessible from Render:
- Use a cloud database service (PlanetScale, Supabase, etc.)
- Update `DATABASE_URL` in environment variables
- Run migrations if needed

## Post-Deployment

1. Check build logs for any errors
2. Verify the app is running at the provided URL
3. Test all functionality
4. Set up custom domain if needed
