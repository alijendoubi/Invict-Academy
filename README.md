# Invict Academy Platform

Welcome to the Invict Academy mono-repository! This repository houses the entire platform, utilizing Turborepo for workspace management safely combining a Next.js Frontend, a NestJS API Backend, and a shared Prisma Database layer.

---

## 🚀 Live Services & Architecture

* **Frontend (Next.js Application)**: Running on `localhost:3000`
* **Backend (NestJS API)**: Running on `localhost:3001`
* **API Documentation (Swagger)**: Available at `http://localhost:3001/api/docs`
* **Database**: PostgreSQL (Hosted on Supabase, `eu-north-1`)
* **Queue / Caching**: Redis (Hosted on Upstash)


## 💻 Getting Started (Local Development)

### 1. Installation
Install all dependencies across the monorepo:
```bash
npm install
```

### 2. Environment Setup
Ensure your `.env` (root), `apps/api/.env`, and `apps/web/.env.local` files contain the correct Supabase `DATABASE_URL` (port `6543`) and `DIRECT_URL` (port `5432`), alongside your Upstash Redis credentials. 

*(If you are launching for the first time, coordinate with the infrastructure admin for these keys).*

### 3. Database Sync
Pull down the latest schema configurations:
```bash
cd packages/db
npx prisma generate
```

### 4. Running the Servers
You can boot individual specific workspaces, or fire up the entire platform concurrently:

**Start Everything:**
```bash
npm run dev
```

**Start Frontend Only:**
```bash
npm run dev --workspace=web
```

**Start Backend Only:**
```bash
npm run dev --workspace=api
```

---

