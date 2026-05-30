# Render Deployment Guide

Backend aur frontend ko Render par alag services ke roop me deploy karo.

## 1. GitHub Push

Project ko GitHub repo me push karo. Render GitHub repo se deploy karega.

## 2. Backend Web Service

Render Dashboard me `New +` -> `Web Service` select karo.

Settings:

```text
Name: devmentor-backend
Root Directory: backened
Runtime: Docker
Dockerfile Path: ./Dockerfile
Health Check Path: /health
```

Environment variables:

```text
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:mysql://YOUR_DB_HOST:3306/YOUR_DB_NAME?useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=YOUR_DB_USER
SPRING_DATASOURCE_PASSWORD=YOUR_DB_PASSWORD
JWT_SECRET=long-random-secret-at-least-32-characters
JWT_EXPIRATION=86400000
CORS_ALLOWED_ORIGINS=https://YOUR_FRONTEND_NAME.onrender.com
```

Backend deploy ke baad URL note karo:

```text
https://YOUR_BACKEND_NAME.onrender.com
```

Health check:

```text
https://YOUR_BACKEND_NAME.onrender.com/health
```

Expected response:

```text
OK
```

## 3. Frontend Static Site

Render Dashboard me `New +` -> `Static Site` select karo.

Settings:

```text
Name: devmentor-frontend
Root Directory: frontened
Build Command: npm ci && npm run build
Publish Directory: build
```

Environment variables:

```text
REACT_APP_API_URL=https://YOUR_BACKEND_NAME.onrender.com/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_or_live_key_id
```

Redirect/rewrite rule add karo, taaki React routes refresh par 404 na dein:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

Frontend deploy ke baad backend service me jaake `CORS_ALLOWED_ORIGINS` ko frontend URL se update karo:

```text
CORS_ALLOWED_ORIGINS=https://YOUR_FRONTEND_NAME.onrender.com
```

Phir backend ko redeploy/restart karo.

## 4. Important Notes

- Razorpay `Key ID` frontend me ja sakta hai.
- Razorpay `Key Secret` frontend me kabhi mat daalo.
- Agar key secret chat/GitHub me leak ho gaya ho, Razorpay dashboard se key regenerate karo.
- Free Render services sleep kar sakti hain; first request slow ho sakti hai.
- Local `.env` file GitHub me push mat karo.
- Render me Java option na dikhe to Docker select karo; backend Dockerfile se build hoga.
