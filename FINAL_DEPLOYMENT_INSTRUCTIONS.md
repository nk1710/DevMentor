# Final Deployment Instructions

## Exact Commands

Run these from `D:\DevMentor`.

```bash
git status
cd backened
.\gradlew.bat clean bootJar -x test
cd ..\frontened
npm run build
cd ..
git add .
git commit -m "Prepare DevMentor for deployment"
git push origin main
```

## Backend Environment Variables - Render

| Variable | Example |
| --- | --- |
| SPRING_PROFILES_ACTIVE | prod |
| SPRING_DATASOURCE_URL | jdbc:mysql://HOST:3306/devmentor?useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC |
| SPRING_DATASOURCE_USERNAME | root |
| SPRING_DATASOURCE_PASSWORD | your_password |
| JWT_SECRET | long_random_secret_at_least_32_chars |
| JWT_EXPIRATION | 86400000 |
| CORS_ALLOWED_ORIGINS | https://your-frontend.vercel.app |
| AGORA_APP_ID | your_agora_app_id |
| AGORA_APP_CERTIFICATE | your_agora_certificate |
| RAZORPAY_KEY_ID | rzp_test_xxxxx |
| RAZORPAY_KEY_SECRET | your_razorpay_secret |

## Frontend Environment Variables - Vercel

| Variable | Example |
| --- | --- |
| REACT_APP_API_URL | https://your-backend.onrender.com/api |
| REACT_APP_RAZORPAY_KEY_ID | rzp_test_xxxxx |
| REACT_APP_AGORA_APP_ID | your_agora_app_id |

## Render Settings

```text
Root Directory: backened
Environment: Docker
Dockerfile Path: ./Dockerfile
Health Check Path: /health
```

## Vercel Settings

```text
Root Directory: frontened
Install Command: npm ci
Build Command: npm run build
Output Directory: build
```

## URLs To Bookmark

- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- Agora Console: https://console.agora.io
- Razorpay Dashboard: https://dashboard.razorpay.com
- GitHub Repo: https://github.com/nk1710/DevMentor

## Testing Commands

```bash
curl https://your-backend.onrender.com/health
curl https://your-backend.onrender.com/api
curl https://your-backend.onrender.com/api/agora/health
```

## Rollback

Render:

1. Open Render service.
2. Go to Events or Deploys.
3. Pick previous successful deploy.
4. Click Redeploy.

Vercel:

1. Open Vercel project.
2. Go to Deployments.
3. Pick previous working deployment.
4. Promote it to production.

Git:

```bash
git log --oneline -5
git revert <bad_commit_hash>
git push origin main
```

## Important Production Note

Video calling currently uses Agora testing mode with a nullable token. This is fine for first deployment/testing. Before paid production use, enable secured Agora tokens by adding the official Agora token-builder SDK in the backend and returning signed RTC tokens from `/api/agora/token`.
