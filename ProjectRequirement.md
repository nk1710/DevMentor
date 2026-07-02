# DevMentor — Project Requirements Document

## 1. Project Overview

**DevMentor** is a full-stack mentorship platform that connects students (Users) with industry professionals (Mentors) for 1:1 video sessions, and enables colleges/institutes to book group mentorship sessions for their students. The platform supports payments, video calling, file sharing, and role-based access control across four user roles.

### Problem Statement
Students and professionals lack an easy, structured way to connect for personalized mentorship. Colleges struggle to organize expert sessions for their students. DevMentor solves this by providing a unified booking + video + payment platform.

### Target Audience
- Indian college students (primary)
- Industry professionals / mentors
- College/institute administrators
- Platform admin

---

## 2. User Roles

| Role | Description | Key Actions |
|------|-------------|-------------|
| **USER (Student)** | Individual looking for mentorship | Browse mentors, book slots, pay, join video calls |
| **MENTOR** | Industry expert providing sessions | Set slots, accept bookings, conduct video sessions, college sessions |
| **COLLEGE** | Institution organizing group sessions | Book mentors for groups, manage sessions, subscription plans |
| **ADMIN** | Platform administrator | Manage all users/mentors/colleges/bookings, upgrade plans |

---

## 3. Core Features

### 3.1 Authentication & Authorization
- JWT-based authentication (24h expiry)
- BCrypt password hashing
- Role-based access control (USER, MENTOR, COLLEGE, ADMIN)
- Protected routes on frontend + backend
- Session stateless (no server-side sessions)

### 3.2 Mentor Discovery & Search
- Browse all mentors with profile cards
- Search mentors by skill (case-sensitive LIKE query)
- View detailed mentor profiles (bio, skills, experience, ratings, pricing)
- Social links (LinkedIn, GitHub) and resume download

### 3.3 Slot Booking System
- Mentors create available time slots (date, startTime, endTime)
- Students view available slots per mentor
- Students book and pay → slot becomes unavailable
- Booking creates an Agora room for video call

### 3.4 Video Calling (Agora RTC)
- 1:1 video sessions between student and mentor
- Room-based joining via channel name
- Microphone and camera toggle controls
- Call timer with cost calculation ($10/min demo rate)
- Waiting room with shareable room link

### 3.5 Payments (Razorpay)
- Client-side Razorpay checkout modal
- Amount calculated from mentor's hourly rate
- Stripe-like flow: Pay → Booking created → Redirect to success
- College subscription plans (BASIC/PRO/ENTERPRISE)

### 3.6 College / Institute Portal
- College registration with contact details
- Subscription plans (BASIC ₹9,999/mo, PRO ₹19,999/mo, ENTERPRISE ₹39,999/mo)
- Book mentors for group sessions
- Upload student questions before sessions
- Track session status (PENDING → CONFIRMED → COMPLETED)
- Plan upgrade flow

### 3.7 File Uploads
- Resume upload (PDF only)
- Profile picture upload (JPEG, PNG, WebP)
- UUID-prefixed filenames to prevent collisions
- Path traversal protection

### 3.8 Admin Panel
- Overview dashboard with entity counts
- CRUD management for users, mentors, colleges
- Booking status management (Confirm/Cancel)
- College session management
- Plan upgrades for colleges

---

## 4. Entity Model

```sql
users:       id, name, email, password, role, bio, skills, location,
             profile_picture, resume_url, phone, linkedin_url, github_url

mentors:     id, name, email, password, skills, experience, price_per_hour,
             price_per_minute, rating, bio, location, profile_picture,
             resume_url, phone, linkedin_url, github_url, designation,
             total_sessions, is_available, role (default 'MENTOR')

colleges:    id, name, email, password, phone, address, city,
             contact_person, plan (BASIC/PRO/ENTERPRISE), is_active,
             subscription_expiry

college_sessions: id, college_id (FK), mentor_id (FK), topic,
             scheduled_date, scheduled_time, status, session_type,
             max_students, room_id, questions (JSON string)

slots:       id, mentor_id (FK), date, start_time, end_time, booked

bookings:    id, user_id (FK), mentor_id (FK), slot_id (FK), status, room_id
```

---

## 5. API Architecture

**Base URL:** `/api`

| Group | Prefix | Auth |
|-------|--------|------|
| Auth/Users | `/api/users` | Mixed (public + authenticated) |
| Mentors | `/api/mentors` | Mixed (public + authenticated) |
| Colleges | `/api/colleges` | Mixed (public + admin) |
| Slots | `/api/slots` | Mixed (public + authenticated) |
| Bookings | `/api/bookings` | Authenticated + admin |
| Files | `/api/files` | Authenticated |
| Agora | `/api/agora` | Authenticated |

### Key Endpoints
- `POST /api/users/register`, `POST /api/users/login`
- `POST /api/mentors/register`, `POST /api/mentors/login`
- `POST /api/colleges/register`, `POST /api/colleges/login`
- `GET /api/mentors/all`, `GET /api/mentors/search?skill=`
- `POST /api/slots/add/{mentorId}`
- `GET /api/slots/available/{mentorId}`
- `POST /api/bookings/create?userId=&mentorId=&slotId=`
- `POST /api/files/upload?type=resume|profile`
- `GET /api/agora/token?channelName=&uid=`
- `GET /api/agora/config`
- `POST /api/colleges/{collegeId}/payment/create?plan=`
- `POST /api/colleges/{collegeId}/payment/success?plan=&paymentId=`

---

## 6. External Integrations

| Service | Purpose | Integration Level |
|---------|---------|-------------------|
| **Agora RTC** | Video/audio calling | Testing mode (token=null) |
| **Razorpay** | Payment processing | Mock implementation |
| **MySQL** | Primary database | Full (via JPA/Hibernate) |
| **H2** | Local/test database | Full |
| **Gradle** | Build tool | Full |
| **Docker** | Containerization | Full |

---

## 7. Non-Functional Requirements

- **Performance:** No caching, no pagination (current state)
- **Security:** JWT auth, BCrypt passwords, CORS configured
- **Availability:** Single-instance deployment (Render free tier)
- **Scalability:** None currently (no load balancing, no connection pooling tuning)
- **Monitoring:** None (no logging framework, no health check enrichment)
- **Testing:** Minimal (single context-load test)

---

## 8. Deployment Architecture

```
Frontend (Vercel/Docker/Nginx)
    │
    ├── React SPA (port 80/443)
    │
    └── API calls via REACT_APP_API_URL
            │
Backend (Render/Docker)
    │
    ├── Spring Boot (port 8080)
    │
    └── MySQL (Aiven/Cloud DB)
```

### Deployment Targets
- **Frontend:** Vercel (static) or Docker/Nginx
- **Backend:** Render (Docker) or Railway
- **Database:** Aiven MySQL or Planetscale
- **Git:** GitHub (nk1710/DevMentor)
