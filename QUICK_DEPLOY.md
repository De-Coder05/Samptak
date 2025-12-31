# Quick Deployment Guide

## 🚀 Fastest Way to Deploy

### 1. Deploy Backend (Railway - Easiest)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

Railway will give you a URL like: `https://your-app.railway.app`

### 2. Deploy Frontend (Vercel)

```bash
cd Frontend

# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
vercel login
vercel --prod
```

### 3. Configure Environment Variable

1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add: `REACT_APP_API_URL` = `https://your-app.railway.app`
5. Redeploy

### 4. Update Backend CORS

Edit `app.py` and add your Vercel URL to `ALLOWED_ORIGINS`:

```python
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://your-app.vercel.app",  # Add this
]
```

Redeploy backend.

## ✅ Done!

Your app is now live:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`

