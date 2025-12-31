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

## Part 2: Deploy Frontend to Vercel ⚡ (Online Dashboard)

1.  **Go to Vercel**: [vercel.com/new](https://vercel.com/new)
2.  **Import Project**:
    *   Connect your GitHub account.
    *   Find the **Samptak** repository and click **Import**.
3.  **Configure Project**:
    *   **Framework Preset**: Select **Vite**.
    *   **Root Directory**: Click "Edit" and select `frontend`.
4.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Add:
        *   **Key**: `VITE_API_URL`
        *   **Value**: `https://your-backend-url.onrender.com` (The URL you got from Render in Part 1)
5.  **Deploy**:
    *   Click **Deploy**.
    *   Wait for the build to complete.

Your frontend is now live! 🚀

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
