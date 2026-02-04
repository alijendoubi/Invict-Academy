# Invict Academy - Frontend-Only Demo Deployment Guide

> **🎯 DEMO MODE ACTIVE**  
> This application is configured for frontend-only operation using mock data. Perfect for demos, presentations, and development without backend infrastructure.

## What's Different in Demo Mode?

✅ **No Database Required** - All data is mocked in-memory  
✅ **No External Services** - Stripe, OpenAI, Redis, and emails are mocked  
✅ **Instant Deployment** - No complex setup, just deploy and go  
✅ **Zero Cost** - No paid external services needed  

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@invict.academy` | `demo123` |
| Student | `student@invict.academy` | `demo123` |

---

## Quick Deploy to Vercel

### 1. Push Your Code

```bash
git add .
git commit -m "Frontend-only demo mode"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `apps/web` ⚠️ **Important!**
   - **Build Command**: Leave as default
   - **Output Directory**: Leave as default

### 3. Set Environment Variables

Click **"Environment Variables"** and add **only these two**:

| Variable | Value |
|----------|-------|
| `DEMO_MODE` | `true` |
| `JWT_SECRET` | `any-random-string-here` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

> **💡 Tip**: Generate JWT_SECRET with: `openssl rand -base64 32`

4. Click **Deploy** 🚀

---

## Local Development

### Setup

```bash
# Navigate to web app
cd apps/web

# Copy demo environment file
cp .env.demo .env.local

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the App

Open [http://localhost:3000](http://localhost:3000) and login with demo credentials.

---

## Testing the Demo

### 1. Admin Dashboard
- Login as `admin@invict.academy` / `demo123`
- View mock statistics
- Browse students, leads, and applications
- All data is realistic but mocked

### 2. Student Dashboard
- Login as `student@invict.academy` / `demo123`  
- View student profile
- Check application status
- View documents and readiness score

### 3. Features to Test
- ✅ Authentication (login/logout)
- ✅ Dashboard statistics
- ✅ Student management
- ✅ Lead tracking
- ✅ Application tracking
- ✅ AI Chat (uses fallback responses)
- ✅ Payment flow (mocked Stripe)
- ✅ Email notifications (logged to console)

---

## Troubleshooting

### Build Fails

**Check:**
- Root directory is set to `apps/web` in Vercel
- `DEMO_MODE=true` environment variable is set
- Node version is 18 or higher

### Can't Login

**Solution:**
- Use exact credentials: `admin@invict.academy` / `demo123`
- Check browser console for errors
- Clear cookies and try again

### Data Not Persisting

**Expected Behavior:**
- Demo mode uses in-memory data
- All data resets on page reload
- This is normal for demo mode

---

## Reverting to Full Backend

To restore full database and services:

1. **Uncomment in `package.json`:**
   - Replace `_comment_*` fields with original dependencies
   
2. **Restore in lib files:**
   - `lib/db.ts` - Uncomment Prisma code
   - `lib/stripe.ts` - Uncomment Stripe code
   - `lib/chat.ts` - Uncomment OpenAI code
   - `lib/email.ts` - Uncomment email service
   - `lib/queue.ts` - Uncomment Redis/BullMQ

3. **Configure environment:**
   - Set `DEMO_MODE=false`
   - Add all required environment variables (see `.env.example`)
   - Setup database and run migrations

4. **Redeploy**

---

## Advanced Configuration

### Custom Domain

1. Go to Vercel **Settings** → **Domains**
2. Add your domain
3. Update `NEXT_PUBLIC_APP_URL` to match
4. Redeploy

### Preview Deployments

Every push to a branch creates a preview deployment:
- Automatic URL: `your-app-git-branch.vercel.app`
- Perfect for testing changes
- Same demo mode configuration

### Performance Optimization

The demo mode is already optimized:
- No database queries
- No external API calls
- Instant response times
- Perfect Lighthouse scores possible

---

## Support & Documentation

- 📚 [Next.js Documentation](https://nextjs.org/docs)
- 🚀 [Vercel Documentation](https://vercel.com/docs)
- 💬 For questions, check the code comments

---

## What's Mocked?

| Service | Status | Console Logs |
|---------|--------|--------------|
| Database (Prisma) | ✅ Mocked | No |
| Stripe Payments | ✅ Mocked | Yes |
| OpenAI Chat | ✅ Mocked | Yes |
| Email (Resend) | ✅ Mocked | Yes |
| Redis/Queues | ✅ Mocked | Yes |
| File Storage (S3) | ✅ Mocked | Yes |

All mocked services log activity to the browser console for debugging.

---

**🎉 That's it!** Your demo instance should be live and fully functional.

For the full deployment guide with database and services, see `DEPLOYMENT_FULL.md`.

---

<details>
<summary><strong>📋 Original Full Deployment Guide (Click to Expand)</strong></summary>

# Invict Academy - Full Production Deployment

This guide is for deploying with a real database and all external services.

## Prerequisites

- Vercel account
- Production PostgreSQL database
- Stripe account (for payments)
- OpenAI API key (for chat)
- Resend account (for emails)
- Redis instance (Upstash recommended)
- AWS S3 bucket (for file uploads)

[... Rest of original deployment guide would go here ...]

</details>

