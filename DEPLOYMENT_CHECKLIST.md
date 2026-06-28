# DevMentor Deployment Checklist

Default plan: backend on Render, frontend on Vercel.

## A. Pre-Deployment Checklist

- [ ] Backend builds: `cd backened` then `.\gradlew.bat clean bootJar -x test`
- [ ] Frontend builds: `cd frontened` then `npm run build`
- [ ] Git status clean: `git status`
- [ ] MySQL database exists: `devmentor`
- [ ] Production backend URL decided
- [ ] Production frontend URL decided
- [ ] Agora App ID ready
- [ ] Razorpay key ready

## B. Account Setup

- [ ] Render account ready: https://render.com
- [ ] Vercel account ready: https://vercel.com
- [ ] GitHub repo pushed: https://github.com/nk1710/DevMentor
- [ ] Agora console ready: https://console.agora.io
- [ ] Razorpay dashboard ready: https://dashboard.razorpay.com

## C. Backend Deployment - Render

Push latest code:

```bash
git add .
git commit -m "Prepare DevMentor deployment"
git push origin main
```

Render manual settings:

```text
Root Directory: backened
Environment: Docker
Dockerfile Path: ./Dockerfile
Health Check Path: /health
```

Render environment variables:

| Variable | Value |
| --- | --- |
| SPRING_PROFILES_ACTIVE | prod |
| SPRING_DATASOURCE_URL | jdbc:mysql://HOST:3306/devmentor?useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC |
| SPRING_DATASOURCE_USERNAME | your_database_user |
| SPRING_DATASOURCE_PASSWORD | your_database_password |
| JWT_SECRET | long_random_secret_at_least_32_chars |
| JWT_EXPIRATION | 86400000 |
| CORS_ALLOWED_ORIGINS | https://your-frontend.vercel.app |
| AGORA_APP_ID | your_agora_app_id |
| AGORA_APP_CERTIFICATE | optional_for_secure_token_mode |
| RAZORPAY_KEY_ID | rzp_test_or_live_xxxxx |
| RAZORPAY_KEY_SECRET | your_razorpay_secret |

Verify backend:

```bash
curl https://your-backend.onrender.com/health
curl https://your-backend.onrender.com/api
curl https://your-backend.onrender.com/api/agora/health
```

## D. Frontend Deployment - Vercel

Vercel settings:

```text
Root Directory: frontened
Install Command: npm ci
Build Command: npm run build
Output Directory: build
```

Vercel environment variables:

| Variable | Value |
| --- | --- |
| REACT_APP_API_URL | https://your-backend.onrender.com/api |
| REACT_APP_RAZORPAY_KEY_ID | rzp_test_or_live_xxxxx |
| REACT_APP_AGORA_APP_ID | your_agora_app_id |

## E. Post-Deployment Testing

- [ ] Frontend opens without blank screen
- [ ] Login/register works
- [ ] Mentor list loads
- [ ] CORS has no browser console errors
- [ ] Payment button opens Razorpay checkout
- [ ] Video call opens camera/mic prompt
- [ ] `/health` returns `OK`
- [ ] Data persists in MySQL

## F. Troubleshooting

### CORS Error

Root cause: backend `CORS_ALLOWED_ORIGINS` does not match frontend URL.

Fix:

```text
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Database Connection Failed

Root cause: wrong database URL, username, password, or remote DB network rules.

Fix:

```text
SPRING_DATASOURCE_URL=jdbc:mysql://HOST:3306/devmentor?useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=your_database_user
SPRING_DATASOURCE_PASSWORD=your_database_password
```

### JWT Startup Error

Root cause: `JWT_SECRET` too short or missing.

Fix:

```text
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_chars
```

### Agora Join Fails

Root cause: wrong App ID, expired token, or Agora project token mode mismatch.

Fix:

```text
REACT_APP_AGORA_APP_ID=your_agora_app_id
AGORA_APP_ID=your_agora_app_id
```

Current implementation supports Agora testing mode with a nullable token. Before paid production use, add official Agora token generation in the backend and return signed RTC tokens from `/api/agora/token`.
