# 🚀 Vercel Deployment Guide (with Cloud PostgreSQL)

Since the local Next.js build is **100% fixed and compiling successfully**, the application is fully ready for deployment to Vercel.

Because Vercel Serverless Functions have an **ephemeral and read-only filesystem**, local SQLite databases (`file:./dev.db`) will not persist data in production. To make the platform stable and production-ready on Vercel, you need to use a cloud PostgreSQL database (such as **Supabase** or **Neon DB**).

Below is the step-by-step guide to migrating your database and deploying the project on Vercel.

---

## 📅 Step 1: Switch Prisma Database Provider to PostgreSQL

The database schema is highly portable and can be swapped to PostgreSQL with simple edits:

1. Open the file `prisma/schema.prisma` in your workspace.
2. Locate the `datasource db` block at lines 8–11:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. Change the provider string from `"sqlite"` to `"postgresql"`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

---

## 🛠️ Step 2: Set Up Your Cloud Database Connection

1. Create a free database on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
2. Retrieve your **Transaction** or **Session** Connection String (which usually starts with `postgres://` or `postgresql://`).
3. Update the `DATABASE_URL` in your `.env` file (and later in the Vercel Dashboard):
   ```env
   DATABASE_URL="postgres://your_postgres_connection_string"
   ```

---

## 📦 Step 3: Initialize and Seed Your Production Database

Once the connection string is set up locally in your `.env`, run these two commands to sync the schema and seed the default accounts:

### 1. Push the Schema to the Cloud DB:
```bash
npx prisma db push
```
*(This command syncs your SQLite-compatible models directly to your PostgreSQL database, creating all tables.)*

### 2. Seed the Default Admin and Employer Accounts:
```bash
node prisma/seed.js
```
*(This runs the seed script to pre-populate the cloud database with `admin@shark.com` and `employer@shark.com` with password `password123`.)*

---

## 🌐 Step 4: Import and Deploy on Vercel

1. Push your local workspace changes (with the fixed files and `tsconfig.json` update) to your Git repository (GitHub/GitLab/Bitbucket):
   ```bash
   git add .
   git commit -m "Fix syntax errors, TS type-casting, and prepare for Vercel deployment"
   git push origin main
   ```
2. Log into your [Vercel Dashboard](https://vercel.com) and click **"Add New" ➔ "Project"**.
3. Import your Git repository.
4. Under **Environment Variables**, copy-paste all settings from your local `.env` file:
   *   `DATABASE_URL` (Use your cloud PostgreSQL URL)
   *   `NEXTAUTH_SECRET` (Use a strong unique random string, e.g., `super_secret_temporary_key_for_dev_123`)
   *   `NEXTAUTH_URL` (Use your live production URL, e.g., `https://your-app-name.vercel.app`)
   *   `NODE_ENV` (`production`)
   *   *(Other optional integration keys like Supabase Storage keys or SMTP credentials)*
5. Click **Deploy**. Vercel will:
   *   Install dependencies.
   *   Trigger the `postinstall` command which automatically compiles Prisma client (`prisma generate`).
   *   Build and compile the Next.js production bundle.
   *   Go live in under 2 minutes!

---

## ✅ Post-Deployment Verification Checklist

*   [ ] Register a new candidate user through the Signup portal.
*   [ ] Log in as `admin@shark.com` and verify that the Admin Dashboard loads correctly and shows live statistics.
*   [ ] Post a job vacancy as an employer and check if it lists correctly on the public jobs page.
