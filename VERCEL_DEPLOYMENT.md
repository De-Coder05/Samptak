# Deploying to Vercel

This guide explains how to deploy the Crack Detection application to Vercel.

## Architecture

- **Frontend (React)**: Deploy to Vercel ✅
- **Backend (FastAPI + TensorFlow)**: Deploy to Railway/Render/Fly.io (Vercel has limitations for ML models)

## Step 1: Deploy Backend First

The backend needs to be deployed separately because:
- TensorFlow models are large (>100MB)
- Vercel serverless functions have size limits (50MB)
- Cold starts are slow with ML models

### Option A: Deploy to Railway (Recommended)

1. **Create Railway Account**: https://railway.app
2. **Create New Project**:
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login
   railway login
   
   # Initialize project
   railway init
   
   # Deploy
   railway up
   ```

3. **Set Environment Variables**:
   - Go to Railway dashboard → Variables
   - No special variables needed for basic deployment

4. **Get Backend URL**: 
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Note this URL for frontend configuration

### Option B: Deploy to Render

1. **Create Render Account**: https://render.com
2. **Create New Web Service**:
   - Connect your GitHub repo
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - Environment: Python 3

3. **Get Backend URL**: 
   - Render provides: `https://your-app.onrender.com`

### Option C: Deploy to Fly.io

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`
2. **Create fly.toml**:
   ```toml
   app = "your-app-name"
   primary_region = "iad"
   
   [build]
     builder = "paketobuildpacks/builder:base"
   
   [[services]]
     internal_port = 8080
     protocol = "tcp"
   
     [[services.ports]]
       handlers = ["http"]
       port = 80
       force_https = true
   ```

3. **Deploy**: `fly deploy`

## Step 2: Deploy Frontend to Vercel

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Navigate to Frontend Directory**:
   ```bash
   cd Frontend
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy**:
   ```bash
   vercel
   ```

5. **Set Environment Variable**:
   - When prompted, or via Vercel dashboard:
   - Variable: `REACT_APP_API_URL`
   - Value: Your backend URL (from Step 1)
   - Example: `https://your-app.railway.app`

6. **Production Deploy**:
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard

1. **Go to Vercel**: https://vercel.com
2. **Import Project**:
   - Connect your GitHub repository
   - Root Directory: Set to `Frontend`
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Add Environment Variable**:
   - Go to Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.com`

4. **Deploy**: Click "Deploy"

## Step 3: Update CORS in Backend

Make sure your backend allows requests from Vercel domain:

```python
# In app.py, update CORS:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "http://localhost:3000"  # For local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Step 4: Test Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Upload an image
3. Check browser console for any CORS errors
4. Verify API calls are going to your backend

## Troubleshooting

### CORS Errors
- Make sure backend CORS includes your Vercel domain
- Check backend logs for blocked requests

### API Connection Issues
- Verify `REACT_APP_API_URL` is set correctly in Vercel
- Check backend is running and accessible
- Test backend URL directly: `curl https://your-backend.com/health`

### Build Failures
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

## Alternative: Full Vercel Deployment (Serverless Functions)

If you want to use Vercel for backend too, you'll need to:

1. **Convert to Serverless Functions**:
   - Create `api/` directory in Frontend
   - Split model loading into smaller chunks
   - Use Vercel's serverless functions

2. **Limitations**:
   - Model size limits (50MB per function)
   - Cold start delays
   - More complex setup

**Recommendation**: Use Railway/Render for backend, Vercel for frontend.

## Quick Deploy Script

Create a `deploy-vercel.sh`:

```bash
#!/bin/bash
echo "Deploying to Vercel..."

cd Frontend

# Build
npm run build

# Deploy
vercel --prod

echo "✅ Deployment complete!"
echo "Don't forget to set REACT_APP_API_URL in Vercel dashboard"
```

Make it executable: `chmod +x deploy-vercel.sh`

