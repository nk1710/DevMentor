# Render Deployment Guide

Deploy the backend and frontend on Render as separate services or using the Blueprint.

## 1. Push to GitHub

Push your repository to GitHub. Render automatically deploys from your GitHub repository.

```bash
git add .
git commit -m "Deploy DevMentor updates"
git push origin main
```

## 2. Option A: Blueprint Deployment (One-Click)

1. In the Render Dashboard, click **New +** -> **Blueprint**.
2. Select your repository `DevMentor`.
3. Render reads `render.yaml` and sets up both the `devmentor-backend` (Docker) and `devmentor-frontend` (Static Site) services automatically.
4. Fill in the required environment variables:
   - `SPRING_DATASOURCE_URL` (Cloud database JDBC URL, e.g., Aiven or TiDB)
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `REACT_APP_API_URL` (Points to `https://devmentor-backend.onrender.com/api`)
   - `REACT_APP_RAZORPAY_KEY_ID`
   - `REACT_APP_AGORA_APP_ID`

---

## 3. Option B: Manual Service Deployment

### Backend Web Service

1. In Render Dashboard, click **New +** -> **Web Service**.
2. Select repository `DevMentor`.
3. Configure settings:
   - **Name**: `devmentor-backend`
   - **Root Directory**: `backened`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Health Check Path**: `/health`

4. Environment Variables:
   ```text
   SPRING_PROFILES_ACTIVE=prod
   SPRING_DATASOURCE_URL=jdbc:mysql://YOUR_DB_HOST:3306/YOUR_DB_NAME?useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC
   SPRING_DATASOURCE_USERNAME=YOUR_DB_USER
   SPRING_DATASOURCE_PASSWORD=YOUR_DB_PASSWORD
   JWT_SECRET=your-secure-random-secret-key-at-least-32-chars
   JWT_EXPIRATION=86400000
   CORS_ALLOWED_ORIGINS=https://devmentor-frontend.onrender.com,https://your-app.vercel.app
   RAZORPAY_KEY_ID=rzp_test_TrIKbte6cETGKo
   RAZORPAY_KEY_SECRET=D81T0U6x3UyMpvmRMBtJvfe3
   AGORA_APP_ID=745dbc4d909e4d6893d1dc7c39d4ad83
   AGORA_APP_CERTIFICATE=2f1bc55eff034f8c925d70732b7c2aa9
   ```

5. Health Check:
   ```text
   https://YOUR_BACKEND_NAME.onrender.com/health
   ```
   Expected response:
   ```text
   OK
   ```

---

### Frontend (Static Site or Vercel)

#### On Render (Static Site):
1. In Render Dashboard, click **New +** -> **Static Site**.
2. Configure settings:
   - **Name**: `devmentor-frontend`
   - **Root Directory**: `frontened`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `build`
3. Environment Variables:
   ```text
   REACT_APP_API_URL=https://YOUR_BACKEND_NAME.onrender.com/api
   REACT_APP_RAZORPAY_KEY_ID=rzp_test_TrIKbte6cETGKo
   REACT_APP_AGORA_APP_ID=745dbc4d909e4d6893d1dc7c39d4ad83
   ```
4. Rewrites/Redirects:
   - Rule: `/*` -> `/index.html` (Rewrite)

#### On Vercel:
1. Go to [vercel.com](https://vercel.com) and import `DevMentor`.
2. Root Directory: `frontened`
3. Add environment variables:
   - `REACT_APP_API_URL`
   - `REACT_APP_RAZORPAY_KEY_ID`
   - `REACT_APP_AGORA_APP_ID`
4. Click Deploy.
