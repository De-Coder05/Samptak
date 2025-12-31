# Samptak Deployment Guide (Hybrid) 🚀

This guide explains how to deploy the Samptak application using a hybrid strategy:
- **Frontend** (React) -> **Vercel** (Best for static/SPA sites)
- **Backend** (FastAPI + TensorFlow) -> **Render** (Best for Docker/Python apps)

## ⚠️ Prerequisite: Large Files (Git LFS)

Your model file (`models/best_model.h5`) is likely ~400MB. GitHub has a 100MB file limit.
**You must use Git Large File Storage (LFS) to push this file.**

1.  **Install Git LFS** (if not installed):
    ```bash
    git lfs install
    ```
2.  **Track the model file**:
    ```bash
    git lfs track "models/*.h5"
    ```
3.  **Commit and Push**:
    ```bash
    git add .gitattributes models/best_model.h5
    git commit -m "Add model with LFS"
    git push origin main
    ```

---

## Part 1: Deploy Backend to Render 🐍

1.  **Create a Render Account**: [render.com](https://render.com)
2.  **Create New Web Service**:
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.
3.  **Configuration**:
    *   **Runtime**: Python 3
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
    *   **Instance Type**: **Free** (Note: Free tier has 512MB RAM. Large ML models might crash. If it crashes, upgrade to Starter or use Railway).
    *   *Tip*: If the model is too heavy for the Free tier, consider [Railway.app](https://railway.app) which handles memory limits slightly better or offers easier paid upgrades.
4.  **Deploy**: Click **Create Web Service**.
5.  **Get URL**: Copy your backend URL (e.g., `https://samptak-backend.onrender.com`).

---

## Part 2: Deploy Frontend to Vercel ⚡

1.  **Create a Vercel Account**: [vercel.com](https://vercel.com)
2.  **Install Vercel CLI** (Recommended):
    ```bash
    npm install -g vercel
    ```
3.  **Deploy**:
    Run this command from the root of your project:
    ```bash
    cd frontend
    vercel
    ```
    *   Accept default settings.
    *   Wait for deployment to finish.
4.  **Connect to Backend**:
    *   Go to your **Vercel Dashboard** -> **Settings** -> **Environment Variables**.
    *   Add a new variable:
        *   **Key**: `VITE_API_URL`
        *   **Value**: `https://your-backend-url.onrender.com` (The URL from Part 1)
    *   **Redeploy**: Go to **Deployments**, click the three dots on the latest deployment, and click **Redeploy** to apply the environment variable.

---

## Verification

1.  Open your Vercel URL (e.g., `https://samptak.vercel.app`).
2.  Upload a track image.
3.  If it analyzes correctly, **Success!** 🎉

---

### Troubleshooting

*   **Backend "Memory Error" or "Killed"**: The model is too big for the free instance RAM.
    *   *Solution*: Upgrade instance type OR try a smaller model architecture (MobileNet).
*   **"Analysis Failed"**: Check if `VITE_API_URL` is set correctly in Vercel (no trailing slash usually, but verify exact URL).
*   **CORS Errors**: I have configured the backend to allow all origins (`*`), so this should not happen.
