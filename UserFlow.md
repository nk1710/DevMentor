# DevMentor — User Flows

## 1. Student (USER) Flow

### 1.1 Registration
```
Landing Page (/)
    │
    ├── Click "Get Started" → /register
    │       │
    │       ├── Select "Student" tab
    │       ├── Fill: Name, Email, Password
    │       ├── Submit → POST /api/users/register
    │       └── Success → alert → redirect /login
    │
    └── Click "Login" → /login
```

### 1.2 Login & Dashboard
```
Login Page (/login)
    │
    ├── Select "Student" tab
    ├── Enter: Email, Password
    ├── Submit → POST /api/users/login
    ├── Success → saveAuth() → redirect /user-dashboard
    └── Dashboard shows:
        ├── Stats: Total Bookings, Confirmed, Completed
        ├── Bookings list with status badges
        └── "Join Video Call" button for confirmed bookings
```

### 1.3 Finding & Booking a Mentor
```
Dashboard → "Find Mentor" or Navbar → "Find Mentors"
    │
    ├── /mentors page
    │   ├── Grid of mentor cards (avatar, name, skills, rating, price)
    │   ├── Search bar: type skill → Enter → GET /api/mentors/search?skill=
    │   └── Reset button to clear search
    │
    ├── Click mentor card → /mentor/:id
    │   ├── Profile: name, designation, bio, skills tags, social links
    │   ├── Price card: ₹/hr, ₹/min, rating, experience
    │   ├── Available slots grid (date, start/end time)
    │   └── Click "Book Now" on a slot
    │
    ├── Not logged in? → redirect /login
    │
    └── Logged in → /payment/:slotId/:mentorId
        ├── Order summary: mentor name, slot, amount
        ├── Click "Pay ₹X" → Razorpay modal opens
        ├── Pay via UPI/Card/NetBanking/Wallet
        ├── On success:
        │   ├── POST /api/bookings/create
        │   ├── Navigate to /payment-success
        │   └── Booking created with roomId
        └── Go to Dashboard
```

### 1.4 Video Call (1:1)
```
Dashboard → Click "Join Video Call" on a booking
    │
    ├── /call/:roomId
    │   ├── Waiting screen (share room link)
    │   ├── Joins Agora RTC channel
    │   ├── Local video preview (right panel)
    │   ├── Remote video main area
    │   ├── Controls: Mic toggle, Camera toggle, Leave (red)
    │   ├── Timer + cost counter
    │   └── Leave → stop tracks → navigate to dashboard
    └── Error handling: mic/cam permission denied
```

### 1.5 Profile Editing
```
Navbar/Dashboard → "Edit Profile"
    │
    ├── /edit-profile
    ├── Fields: bio, location, phone, skills, LinkedIn, GitHub
    ├── Resume upload (PDF)
    ├── Save → PUT /api/users/profile/{id}
    └── Cancel → back to dashboard
```

---

## 2. Mentor Flow

### 2.1 Registration
```
Landing / Navbar → "Become a Mentor" → /register
    │
    ├── Select "Mentor" tab
    ├── Fill: Name, Email, Password
    ├── Mentor-only: Skills, Experience, Price/Hour
    ├── Submit → POST /api/mentors/register
    └── Success → alert → redirect /login
```

### 2.2 Login & Dashboard
```
Login → Select "Mentor" tab → POST /api/mentors/login
    │
    └── /mentor-dashboard
        ├── Stats: Individual Sessions, Confirmed, College Sessions, Demo Earnings
        ├── "Add Slot" form (date, startTime, endTime)
        ├── Tab: Individual Bookings
        │   ├── Student name, slot details, status badge
        │   └── "Start Session" button (goes to /call/:roomId)
        ├── Tab: College Sessions
        │   ├── College name, topic, date, status
        │   ├── "Confirm Session" (PENDING → CONFIRMED)
        │   ├── "Start Live Session" (CONFIRMED → /call/:roomId)
        │   └── "Complete" (CONFIRMED → COMPLETED)
        └── Questions from college section
```

### 2.3 Slot Management
```
Mentor Dashboard → "Add Slot"
    │
    ├── Enter Date, Start Time, End Time
    ├── Submit → POST /api/slots/add/{mentorId}
    └── Slot now visible on public mentor profile
```

### 2.4 Profile Editing
```
Navbar → "Edit Profile"
    │
    ├── /edit-profile (mentor fields: designation, experience, price/hr, price/min)
    ├── Resume upload, profile pic
    └── Save → PUT /api/mentors/profile/{id}
```

---

## 3. College/Institute Flow

### 3.1 Registration
```
Landing → "For Colleges" → /register
    │
    ├── Select "College" tab
    ├── Fill: Name, Email, Password
    ├── College-only: Contact Person, Phone, City, Address
    ├── Default plan: BASIC
    ├── Submit → POST /api/colleges/register
    └── Success → alert → redirect /login
```

### 3.2 Login & Dashboard
```
Login → Select "College" tab → POST /api/colleges/login
    │
    └── /college-dashboard
        ├── Sidebar: Overview, Book Session, Sessions, Upload Questions, Plans
        ├── Overview: Plan info, session count, subscription expiry, recent sessions
        ├── Book Session:
        │   ├── Select mentor (dropdown)
        │   ├── Topic, Date, Time, Session Type (LIVE/RECORDED), Max Students
        │   └── Submit → POST /api/colleges/{collegeId}/sessions/book/{mentorId}
        ├── Sessions list: topic, mentor, date/time, status
        │   ├── "Join Live Session" button
        │   └── Status management
        ├── Upload Questions: select session → textarea → save
        └── Plans: BASIC (₹9,999/mo), PRO (₹19,999/mo), ENTERPRISE (₹39,999/mo)
```

### 3.3 Plan Upgrade
```
Dashboard → Plans tab
    │
    ├── Feature comparison tables
    ├── "Contact us for upgrade" (currently manual)
    └── Admin can upgrade via PUT /api/colleges/upgrade/{id}
```

### 3.4 Session Lifecycle
```
PENDING (newly booked)
    │
    ├── Mentor confirms → PUT .../confirm → CONFIRMED
    │
    ├── Mentor starts → /call/:roomId → LIVE
    │
    └── Mentor completes → PUT .../complete → COMPLETED
```

---

## 4. Admin Flow

### 4.1 Login
```
Login → must have role "ADMIN" (seeded in DB)
    │
    └── POST /api/users/login (role=ADMIN) → redirect /admin
```

### 4.2 Admin Dashboard
```
/admin
    │
    ├── Sidebar: Overview, Users, Mentors, Bookings, Colleges, Sessions
    ├── Overview: Count cards for all entities
    ├── Users Tab:
    │   ├── Table: name, email, role
    │   └── Delete button
    ├── Mentors Tab:
    │   ├── Table: name, email, skills, rating, price
    │   └── Delete button
    ├── Bookings Tab:
    │   ├── Table: user, mentor, slot, status
    │   └── Confirm / Cancel buttons
    ├── Colleges Tab:
    │   ├── Table: name, plan, status, expiry
    │   └── Delete button
    └── Sessions Tab:
        ├── Table: college, mentor, topic, date, status
        └── Confirm / Complete buttons
```

### 4.3 Plan Management
```
Colleges Tab → Cannot directly upgrade from UI
    │
    └── Admin must call PUT /api/colleges/upgrade/{id}?plan=&expiry=
        (currently no button in admin panel for upgrades)
```

---

## 5. Common Flows

### 5.1 Authentication (All Roles)
```
Any protected action
    │
    ├── Check localStorage for token
    ├── No token → Redirect /login
    ├── Token expired (401) → Clear auth → Redirect /login
    └── Token valid → Proceed
```

### 5.2 File Upload
```
Profile/Resume upload
    │
    ├── Select file (PDF for resume, JPG/PNG/WebP for profile)
    ├── Client validates type
    ├── POST /api/files/upload?type=resume|profile
    ├── Server sanitizes filename, generates UUID
    ├── Returns {url, fileName}
    └── URL saved to user/mentor profile
```

### 5.3 Navigation
```
Global Navbar (desktop):
    Logo | Find Mentors | About Us | Contact | For Colleges
    [Logged out] → Login | Get Started
    [Logged in] → Name/Initial | Dashboard | Logout

Footer:
    Brand + Social | Platform | Company | Legal
    Stats: 500+ Mentors, 10K+ Sessions, 4.9* Rating

Navbar hidden on: /call/* (video page), /admin
```

---

## 6. Error States

| Scenario | User Sees | System Response |
|----------|-----------|-----------------|
| Login wrong credentials | Red banner: "Invalid email or password" | 401 response |
| Registration fails | alert() message | 400 response |
| Unauthorized (no token) | Redirect to /login | 401 → interceptor clears auth |
| Unauthorized (wrong role) | Redirect to / | ProtectedRoute check |
| Network error | Varies (mostly console.error, some alerts) | Axios error |
| Video call mic/cam denied | Red error banner | error.message in state |
| Payment fails | Razorpay error modal | Razorpay native error |
| Empty data | "No bookings yet" etc. with CTA | Empty array from API |

---

## 7. Edge Cases

- **Logged-in user visits /login** → not handled (shows login page anyway)
- **Booking same slot twice** → no optimistic locking → possible double booking
- **Video call no remote user** → waiting screen indefinitely
- **File upload too large** → Spring returns 400 (MaxUploadSizeExceededException)
- **Expired JWT** → 401 interceptor logs out
- **Browser back after payment** → no idempotency on booking creation
- **College subscription expired** → no check before session booking
