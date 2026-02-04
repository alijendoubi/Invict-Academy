# 🎯 Invict Academy - Demo Mode

> **This repository is configured for FRONTEND-ONLY demo operation.**

## Quick Start

### Local Development

```bash
cd apps/web
cp .env.demo .env.local
npm install
npm run dev
```

Visit http://localhost:3000

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@invict.academy` | `demo123` |
| **Student** | `student@invict.academy` | `demo123` |

## Deploy to Vercel

1. Push code to GitHub
2. Import on [Vercel](https://vercel.com/new)
3. Set root directory to: `apps/web`
4. Add environment variables:
   - `DEMO_MODE=true`
   - `JWT_SECRET=any-random-string`
   - `NEXT_PUBLIC_APP_URL=https://your-app.vercel.app`
5. Deploy! 🚀

## What's Different?

**✅ NO SETUP NEEDED FOR:**
- Database (uses mock data)
- Stripe payments (mocked)
- OpenAI chat (uses fallback responses)
- Email service (logged to console)
- Redis queues (mocked)
- AWS S3 (mocked)

**✅ FULLY FUNCTIONAL:**
- All UI and pages
- Authentication & sessions
- Admin dashboard with statistics
- Student dashboard  
- Applications & document tracking
- Lead management
- AI chatbot
- Payment flow

## Documentation

- 📖 [**Deployment Guide**](./DEPLOYMENT.md) - How to deploy demo mode
- 📋 [**Walkthrough**](./.gemini/antigravity/brain/*/walkthrough.md) - Full implementation details
- 🔄 [**Reverting Guide**](./DEPLOYMENT.md#reverting-to-full-backend) - How to restore full backend

## Features

- ✨ **Zero external dependencies**
- ⚡ **Instant deployment**
- 💰 **$0 ongoing costs**
- 🎨 **Full UI functionality**
- 🔐 **Secure authentication**
- 📊 **Realistic mock data**

## Restoring Full Backend

To use with real database and services:

1. Restore dependencies in `apps/web/package.json`
2. Uncomment code in `apps/web/src/lib/*.ts` files
3. Set `DEMO_MODE=false`
4. Configure all environment variables
5. Setup database and run migrations

See [Deployment Guide](./DEPLOYMENT.md) for details.

---

**🎉 Demo Mode Active** - Perfect for presentations, development, and testing!
