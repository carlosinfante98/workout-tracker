# Deployment Guide - Cloud Deployment

This guide will help you deploy your Workout Tracker application to the cloud so your friends can access it online.

## ⚠️ Important Notice

Railway has plan limitations that may prevent deployment. This guide now includes **multiple deployment options** for your convenience.

## Deployment Options

### Option 1: Render (Recommended - Free Tier)

### Option 2: Railway (May require paid plan)

### Option 3: Vercel + PlanetScale (Alternative)

## Prerequisites

1. A cloud platform account (Render/Railway/Vercel)
2. Git repository (already set up)
3. Docker installed locally (for testing)

## 🚀 OPTION 1: Render Deployment (Recommended)

### Step 1: Set up Render Account

1. Go to [Render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### Step 2: Deploy to Render

1. **One-Click Deploy**: Click the button below to deploy directly:
   [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/carlosinfante98/workout-tracker)

2. **Manual Deploy**:
   - Fork this repository
   - Go to Render Dashboard
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file and deploy all services

### Step 3: Services Created

Render will create:

- **PostgreSQL Database** (Free tier)
- **Backend API** (Node.js service)
- **Frontend App** (Static site)

### Step 4: Access Your App

After deployment (5-10 minutes):

- **Your App URL**: `https://workout-tracker-frontend.onrender.com`
- **API URL**: `https://workout-tracker-backend.onrender.com`

**Share the frontend URL with your friends!**

---

## 🔧 OPTION 2: Railway Deployment (May require paid plan)

### Step 1: Set up Railway Account

1. Go to [Railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### Step 2: Deploy to Railway

### Option A: One-Click Deploy (Recommended)

1. Click this button to deploy directly:
   [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/fYsdfK)

### Option B: Manual Deploy

1. Create a new Railway project
2. Connect your GitHub repository
3. Railway will automatically detect the Docker setup

## Step 3: Configure Environment Variables

In your Railway project dashboard, add these environment variables:

### For the Server Service:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-long-and-random
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-url.railway.app
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### For the Client Service:

```
VITE_API_URL=https://your-backend-url.railway.app/api
```

## Step 4: Set up Database

1. In Railway, add a PostgreSQL database service
2. Railway will automatically provide the DATABASE_URL
3. Update your server's DATABASE_URL environment variable

## Step 5: Deploy Services

Railway will deploy in this order:

1. PostgreSQL Database
2. Node.js Backend (with automatic migrations)
3. React Frontend
4. Nginx Reverse Proxy

## Step 6: Access Your Application

Once deployed, Railway will provide you with:

- Backend URL: `https://your-backend-url.railway.app`
- Frontend URL: `https://your-frontend-url.railway.app`

Share the Frontend URL with your friends!

## Environment Variables Details

### Required Variables:

- `DATABASE_URL`: Provided automatically by Railway PostgreSQL
- `JWT_SECRET`: Generate a secure random string
- `CORS_ORIGIN`: Your frontend Railway URL
- `VITE_API_URL`: Your backend Railway URL + `/api`

### Optional Variables:

- `JWT_EXPIRES_IN`: Token expiration time (default: 7d)
- `BCRYPT_ROUNDS`: Password hashing rounds (default: 12)
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window (default: 15 min)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default: 100)

## Troubleshooting

### Common Issues:

1. **Database Connection Error**

   - Check DATABASE_URL is correctly set
   - Ensure PostgreSQL service is running

2. **CORS Errors**

   - Verify CORS_ORIGIN matches your frontend URL
   - Check VITE_API_URL is correct

3. **Build Failures**
   - Check Docker files are properly configured
   - Verify all dependencies are in package.json

### Logs

- Check Railway dashboard for deployment logs
- Use `railway logs` CLI command for detailed logs

## Alternative: Quick Deploy Script

Run this command to use the deployment script:

```bash
./deployment/deploy.sh prod
```

## Cost Estimation

Railway free tier includes:

- 500 hours of usage per month
- 1GB RAM
- 1GB storage
- Custom domains

Perfect for sharing with friends!

## Support

If you encounter issues:

1. Check Railway documentation
2. Review application logs in Railway dashboard
3. Ensure all environment variables are set correctly
