# Deployment Guide

## Vercel Deployment (Recommended)

### Step 1: Prepare Your Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: EmailCraft AI"

# Create main branch
git branch -M main

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/emailcraft-ai.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: npm run build
   - **Output Directory**: .next

### Step 3: Add Environment Variables

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add:
   - `OPENROUTER_API_KEY` = your_api_key_here
   - `NEXT_PUBLIC_API_URL` = https://your-app.vercel.app

### Step 4: Deploy

Click "Deploy" and wait for build to complete.

### Step 5: Test

1. Visit your live URL
2. Test email generation
3. Verify all features work

## Alternative: Railway

### Backend Deployment

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Deploy from GitHub
4. Add environment variables
5. Set start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend Deployment

1. Deploy frontend separately on Vercel or Netlify
2. Set `NEXT_PUBLIC_API_URL` to your Railway backend URL

## Environment Variables Reference

### Backend (.env)
```
OPENROUTER_API_KEY=sk-or-v1-xxxxx
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] Email generation works
- [ ] All tone options functional
- [ ] Copy button works
- [ ] Error handling displays properly
- [ ] Responsive design looks good
- [ ] API calls complete successfully

## Troubleshooting

### Build Fails
- Check Node version is 18+
- Verify all dependencies in package.json
- Check for TypeScript errors

### API Not Connecting
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS settings in backend
- Verify environment variables are set

### API Key Errors
- Confirm OPENROUTER_API_KEY is valid
- Check API key has credits available
- Verify no extra spaces in key

## Monitoring

Once deployed, monitor:
- Response times
- Error rates
- API usage
- User feedback

Use Vercel Analytics or add services like:
- Sentry (error tracking)
- LogRocket (session replay)
- Posthog (analytics)
