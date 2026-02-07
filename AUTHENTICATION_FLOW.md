# Complete Authentication Flow - Sharkedutech

## Overview
The application now has a complete authentication system with two methods: **Password Login** and **OTP Login**.

---

## 1. SIGNUP FLOW (2-Step Process)

### Step 1: Create Account Form
**URL:** `http://localhost:3001/auth/signup`

Users select their role (Candidate or Employer) and fill in:
- **Full Name** (required)
- **Email Address** (required)
- **Password** (required, stored hashed in database)
- **Company Name** (if Employer)
- **Industry** (if Employer)

### Step 2: Email Verification via OTP
After submitting the form:
1. System sends a **6-digit OTP code** to the provided email
2. User enters the OTP code in the verification form
3. OTP is verified via Supabase
4. Account is created in Prisma database with encrypted password
5. User is redirected to login page

**Test Mode:** Use `test@example.com` with OTP code `000000`

---

## 2. LOGIN FLOW (Two Options)

### Option A: Password Login
**URL:** `http://localhost:3001/auth/signin`

1. Click **"Login with Password"**
2. Enter email and password
3. NextAuth verifies credentials against Prisma database
4. Session is created
5. User is redirected to dashboard based on role:
   - **ADMIN** → `/admin`
   - **EMPLOYER** → `/jobs/employer`
   - **CANDIDATE** → `/jobs`

### Option B: OTP Login (Passwordless)
**URL:** `http://localhost:3001/auth/signin`

1. Click **"Login with OTP"**
2. Enter email
3. System sends 6-digit OTP code via Supabase
4. User enters OTP code
5. If user doesn't exist in Prisma, auto-creates user
6. Session is created
7. User is redirected to dashboard

---

## 3. NAVBAR BEHAVIOR

The navbar automatically:
- **When logged out:** Shows "Candidate Login" and "Partner/Admin Login" buttons
- **When logged in:** Shows user's name (e.g., "Hi, John Doe") + "Dashboard" button + "Logout" button

---

## 4. TECHNOLOGY STACK

### Frontend
- **Next.js 16.1.3** with TypeScript
- **NextAuth.js 4.24.13** for session management
- **Supabase Auth** for OTP delivery

### Backend
- **NextAuth Credentials Provider** for password authentication
- **Prisma ORM** for database
- **bcryptjs** for password hashing
- **Supabase** for OTP (passwordless auth)

### Database
- SQLite (dev.db) with Prisma schema

---

## 5. DATA FLOW

### Password Signup → Login
```
User fills form
↓
Email OTP verification (Supabase)
↓
Account created in Prisma (password hashed)
↓
User logs in with email + password
↓
NextAuth validates against Prisma
↓
Session created + Redirect to dashboard
```

### OTP Login (Passwordless)
```
User enters email
↓
OTP sent via Supabase
↓
User enters OTP code
↓
OTP verified via Supabase
↓
Check if user exists in Prisma
  → If NO: Auto-create user with OTP flag
  → If YES: Continue
↓
Session created + Redirect to dashboard
```

---

## 6. TESTING CREDENTIALS

### For Development (Test Mode)
```
Email: test@example.com (or any email containing "test")
OTP Code: 000000
```

### For Real Email
```
Email: Any real email address
OTP: 6-digit code sent via Supabase
Password: Any password you set during signup
```

---

## 7. KEY FEATURES

✅ **Two Authentication Methods**
- Password-based (traditional)
- OTP-based (passwordless)

✅ **Role-Based Access**
- CANDIDATE
- EMPLOYER
- ADMIN

✅ **Rate Limiting Protection**
- 1 OTP per email per 60 seconds
- Smart error messages with countdown timer

✅ **Email Verification**
- Mandatory email verification during signup
- OTP expires in 10 minutes (Supabase default)

✅ **Session Management**
- JWT-based sessions via NextAuth
- Automatic session refresh

✅ **User Profile**
- Name displayed in navbar
- Role-based dashboard redirect

---

## 8. FILE STRUCTURE

```
src/
├── app/
│   ├── auth/
│   │   ├── signin/page.tsx          (Login with 2 methods)
│   │   ├── signup/page.tsx          (Signup with OTP verification)
│   │   ├── callback/page.tsx        (OTP callback handler)
│   │   └── ...
│   └── api/auth/
│       ├── [...nextauth]/route.ts   (NextAuth config)
│       ├── signup/route.ts          (Create account API)
│       └── supabase-sync/route.ts   (Sync OTP user to Prisma)
├── lib/
│   ├── supabase.ts                  (OTP functions)
│   ├── prisma.ts                    (Database client)
│   └── ...
└── components/
    ├── auth/
    │   ├── OTPInput.tsx             (6-digit input)
    │   └── ...
    └── layout/
        └── Navbar.tsx               (Shows username when logged in)
```

---

## 9. FLOW SUMMARY

| Step | Action | Technology |
|------|--------|------------|
| 1 | User signs up with email & password | Prisma + bcrypt |
| 2 | OTP sent to email | Supabase |
| 3 | User verifies OTP | Supabase |
| 4 | Account created | Prisma |
| 5 | User logs in | NextAuth |
| 6 | Session created | NextAuth JWT |
| 7 | Dashboard access | Role-based routing |

---

## 10. WHAT'S IMPLEMENTED ✅

- ✅ Signup with password + OTP email verification
- ✅ Login with password
- ✅ Login with OTP (passwordless)
- ✅ Navbar shows username when logged in
- ✅ Role-based dashboard redirect
- ✅ Rate limiting protection
- ✅ Session management
- ✅ Auto-create user on first OTP login
- ✅ Test mode for development
- ✅ Resend OTP functionality
