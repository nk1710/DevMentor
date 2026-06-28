DevMentor
India's Real-Time Developer Mentorship Platform
Book 1-on-1 sessions with expert developers · Pay securely · Learn via live video call

## 📌 What is DevMentor?

**DevMentor** is a full-stack, production-ready mentorship booking platform — think *Astrotalk*, but for software developers.

> "Instead of spending hours on YouTube hoping to find the answer, just book 10 minutes with someone who already knows it."

Developers can **monetise their expertise**. Students get **instant, affordable, personalised guidance** — via live video call.
# ✨ Features

| Feature | Description |
|--------|-------------|
| 🔐 **JWT Authentication** | Secure login for Students, Mentors & Admin with BCrypt password encryption |
| 👤 **Dual Role System** | Separate flows for Students and Mentors with role-based access |
| 📅 **Slot Booking** | Mentors create time slots; students browse and book with one click |
| 💳 **Razorpay Payments** | Secure payment gateway before session confirmation |
| 🎥 **Live Video Call** | Real-time 1-on-1 video sessions powered by Agora WebRTC SDK |
| ⏱️ **Per-Minute Billing** | Live cost meter runs during the video call |
| 📄 **Resume Upload** | Mentors and students can upload resumes to their public profiles |
| 🔍 **Mentor Discovery** | Search and filter mentors by skill, price, rating and availability |
| 🛡️ **Admin Dashboard** | Full control panel — manage users, mentors, bookings and revenue |
| 📋 **Legal Pages** | Privacy Policy, Terms & Conditions, Refund Policy |

---

## 🛠️ Tech Stack

### Backend
- **Java 17** + **Spring Boot 3**
- **Spring Security** — authentication and CORS
- **Spring Data JPA** + **Hibernate**
- **JWT** (jjwt) + **BCrypt** — stateless auth + password encryption
- **MySQL** — relational database

### Frontend
- **React.js** — single-page application
- **React Router DOM** — client-side routing
- **Tailwind CSS** — utility-first dark UI
- **Axios** — HTTP client

### Integrations
- **Razorpay** — payment gateway
- **Agora RTC SDK** — real-time video/audio calls

---

## 🗂️ Project Structure

```
devmentor/
│
├── backened/                        # Spring Boot Backend
│   └── src/main/java/com/example/demo/
│       ├── controller/              # REST API Controllers
│       │   ├── UserController.java
│       │   ├── MentorController.java
│       │   ├── SlotController.java
│       │   ├── BookingController.java
│       │   ├── FileUploadController.java
│       │   └── AgoraTokenController.java
│       ├── service/                 # Business Logic
│       │   ├── UserService.java
│       │   ├── MentorService.java
│       │   ├── SlotService.java
│       │   └── BookingService.java
│       ├── entity/                  # JPA Entities
│       │   ├── User.java
│       │   ├── Mentor.java
│       │   ├── Slot.java
│       │   └── Booking.java
│       ├── repository/              # JPA Repositories
│       ├── dto/                     # Data Transfer Objects
│       │   ├── LoginRequest.java
│       │   └── LoginResponse.java
│       └── config/                  # Security & JWT Config
│           ├── SecurityConfig.java
│           └── JwtUtil.java
│
└── frontened/                       # React Frontend
    └── src/
        ├── pages/
        │   ├── Home.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── MentorList.js
        │   ├── MentorProfile.js
        │   ├── UserDashboard.js
        │   ├── MentorDashboard.js
        │   ├── AdminDashboard.js
        │   ├── Payment.js
        │   ├── PaymentSuccess.js
        │   ├── VideoCall.js
        │   ├── EditProfile.js
        │   ├── AboutUs.js
        │   ├── ContactUs.js
        │   ├── PrivacyPolicy.js
        │   ├── TermsAndConditions.js
        │   └── RefundPolicy.js
        ├── services/
        │   └── api.js               # All API calls
        ├── utils/
        │   └── auth.js              # Auth helpers
        └── components/
            └── ProtectedRoute.js    # Route guard
```

---

## 🗄️ Database Schema

```
users          → id, name, email, password, role, bio, skills, location, resumeUrl ...
mentors        → id, name, email, password, skills, experience, pricePerHour, rating ...
slots          → id, mentor_id, date, startTime, endTime, booked
bookings       → id, user_id, mentor_id, slot_id, status, roomId
```

---

## ⚙️ Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Razorpay Test Account
- Agora Console Account

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/devmentor.git
cd devmentor
```

---

### 2. Setup Database

```sql
CREATE DATABASE devmentor;
```

---

### 3. Configure Backend

Edit `backened/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/devmentor
spring.datasource.username=root
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

server.port=8080
```

---

### 4. Run Backend

```bash
cd backened
./gradlew bootRun
```

Backend starts at: `http://localhost:8080`

---

### 5. Configure Frontend

Create `.env.local`:

```properties
REACT_APP_API_URL=http://localhost:8080/api
```

Edit `frontened/src/pages/VideoCall.js`:

```javascript
const APP_ID = 'YOUR_AGORA_APP_ID';
```

---

### 6. Run Frontend

```bash
cd frontened
npm install
npm start
```

Frontend starts at: `http://localhost:3000`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register student |
| POST | `/api/users/login` | Student login → returns JWT |
| POST | `/api/mentors/register` | Register mentor |
| POST | `/api/mentors/login` | Mentor login → returns JWT |

### Mentors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mentors/all` | Get all mentors |
| GET | `/api/mentors/{id}` | Get mentor by ID |
| GET | `/api/mentors/search?skill=Java` | Search by skill |
| PUT | `/api/mentors/profile/{id}` | Update mentor profile |

### Slots & Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/slots/add/{mentorId}` | Mentor adds a slot |
| GET | `/api/slots/available/{mentorId}` | Get available slots |
| POST | `/api/bookings/create` | Book a slot |
| GET | `/api/bookings/user/{userId}` | Get user bookings |
| GET | `/api/bookings/mentor/{mentorId}` | Get mentor bookings |

### Video
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agora/token?channelName=&uid=` | Generate Agora token |

---

## 🔐 Security

- Passwords encrypted with **BCrypt**
- Stateless auth via **JWT tokens** (24hr expiry)
- CORS configured for frontend origin
- Role-based access control (USER / MENTOR / ADMIN)
- Admin dashboard protected by email-based guard

---

## 🚀 Deployment

| Layer | Platform |
|-------|----------|
| Backend | Railway |
| Frontend | Vercel |
| Database | Railway MySQL |

---

## 📱 User Flow

```
Register / Login
      ↓
Browse Mentors → View Profile
      ↓
Select Slot → Payment (Razorpay)
      ↓
Booking Confirmed
      ↓
Join Video Call (Agora)
      ↓
Live Session with Timer + Cost Meter
      ↓
Session Complete → Dashboard
```

---

## 🗺️ Roadmap

- [x] JWT Authentication
- [x] Slot Booking System
- [x] Razorpay Payment Gateway
- [x] Live Video Call (Agora WebRTC)
- [x] Per-Minute Billing
- [x] Admin Dashboard
- [x] Resume Upload
- [ ] Mobile App (React Native)
- [ ] Real-time Chat
- [ ] Ratings & Reviews
- [ ] Email Notifications
- [ ] AI Mentor Recommendations

---

## 👨‍💻 Built By

**Nikhil Singh** — Java Full Stack Developer

- 🔗 LinkedIn: [linkedin.com/in/Nikhil(linkedin.com/in/nikhilsingh1710)
- 📧 Email: nikhilsingh1710@gmail.com
- 🐙 GitHub: [github.com/nk1710](https://github.com/nk1710)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**⭐ If you found this project useful, please give it a star!**

Built with ❤️ in India

</div>
