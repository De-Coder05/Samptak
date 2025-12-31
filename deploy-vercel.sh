#!/bin/bash
echo "🚀 Deploying Frontend to Vercel..."

cd Frontend

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the project
echo "📦 Building React app..."
npm run build

# Deploy to Vercel
echo "☁️  Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "⚠️  IMPORTANT: Set environment variable in Vercel dashboard:"
echo "   REACT_APP_API_URL = https://your-backend-url.com"
echo ""
echo "📝 Steps:"
echo "   1. Go to https://vercel.com/dashboard"
echo "   2. Select your project"
echo "   3. Go to Settings → Environment Variables"
echo "   4. Add REACT_APP_API_URL with your backend URL"
echo "   5. Redeploy if needed"
