# Invict Academy - Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the Invict Academy platform to Vercel.

## Prerequisites

- Vercel account ([sign up here](https://vercel.com/signup))
- GitHub account with the repository pushed
- Production PostgreSQL database (Vercel Postgres, Supabase, Railway, or Neon)
- API keys for external services (optional, but recommended for full functionality)

---

## 1. Prepare Your Database

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Click on **Storage** → **Create Database** → **Postgres**
3. Follow the setup wizard
4. Copy the `POSTGRES_PRISMA_URL` connection string

### Option B: External Database (Supabase, Railway, Neon)

1. Create a PostgreSQL database with your preferred provider
2. Copy the connection string in the format:
   ```
   postgresql://user:password@host:port/database
   ```

---

## 2. Push Your Code to GitHub

```bash
# On the vercel-deployment branch
git add .
git commit -m "Prepared for Vercel deployment"
git push origin vercel-deployment
```

---

## 3. Deploy to Vercel

### Initial Setup

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `alijendoubi/Invict-Academy`
3. Configure the project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `apps/web` ⚠️ **Important!**
   - **Build Command**: Leave as default (uses vercel.json)
   - **Output Directory**: Leave as default
   - **Install Command**: Leave as default

### Environment Variables Configuration

Before deploying, click **"Environment Variables"** and add the following:

#### Required Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for JWT tokens (generate with `openssl rand -base64 32`) | `your-random-32-char-string` |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL | `https://your-app.vercel.app` |

#### Optional but Recommended

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `STRIPE_SECRET_KEY` | Stripe payments | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification | After setting up webhook |
| `OPENAI_API_KEY` | AI chatbot functionality | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `RESEND_API_KEY` | Email notifications | [Resend](https://resend.com/api-keys) |
| `FROM_EMAIL` | Email sender address | `noreply@yourdomain.com` |
| `REDIS_URL` | Queue and cache (use Upstash) | [Upstash Console](https://console.upstash.com) |
| `S3_BUCKET` | Document storage | AWS S3 bucket name |
| `S3_REGION` | AWS region | `us-east-1` |
| `S3_ACCESS_KEY` | AWS access key | From AWS IAM |
| `S3_SECRET_KEY` | AWS secret key | From AWS IAM |

> **💡 Tip**: You can set `DEMO_MODE=true` to use mock data if external services aren't configured yet.

4. Click **Deploy**

---

## 4. Run Database Migrations

After the first deployment succeeds, you need to initialize the database:

### Method 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Pull environment variables locally
vercel env pull .env.local

# Run migrations
npm run db:migrate --workspace=@invict/db

# Seed database with initial data (optional)
npm run db:seed --workspace=@invict/db
```

### Method 2: Using Vercel Dashboard

1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add a new variable: `SKIP_ENV_VALIDATION=true`
4. Redeploy the project
5. The migrations should run during build via the `postinstall` script

---

## 5. Configure Stripe Webhooks (Optional)

If you're using Stripe for payments:

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter URL: `https://your-app.vercel.app/api/payments/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** and add it to Vercel as `STRIPE_WEBHOOK_SECRET`
6. Redeploy

---

## 6. Verify Deployment

### Test Basic Functionality

1. **Homepage**: Visit `https://your-app.vercel.app`
   - Should load without errors
   - Check that the UI renders correctly

2. **Authentication**: Go to `/auth/login`
   - Try logging in (if demo mode is enabled, demo credentials should work)
   - Or test signup flow

3. **Database Connection**: Navigate to `/dashboard`
   - Should connect to database without errors
   - If you see data, database is working correctly

4. **API Routes**: Check `/api/dashboard/stats`
   - Should return JSON data
   - Verify no 500 errors in Vercel logs

### Check Vercel Logs

1. Go to your project dashboard
2. Click **Deployments** → Select latest deployment
3. Click **View Function Logs**
4. Look for any errors or warnings

---

## 7. Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` environment variable to match your domain
5. Redeploy

---

## Troubleshooting

### Build Fails with "Cannot find module '@invict/db'"

**Solution**: Ensure the root directory is set to `apps/web` in Vercel settings, and the build command includes workspace context.

### Database Connection Errors

**Solution**: 
- Verify `DATABASE_URL` is correct in environment variables
- Ensure database is accessible from Vercel (check firewall rules)
- For Vercel Postgres, use `POSTGRES_PRISMA_URL` not `POSTGRES_URL`

### Redis Connection Errors

**Solution**:
- The app has fallback logic for missing Redis
- For production, use [Upstash Redis](https://upstash.com) (Vercel recommended)
- Set `REDIS_URL` environment variable

### Missing Environment Variables

**Solution**:
- Check `.env.example` for required variables
- Set `DEMO_MODE=true` to run without external services
- Redeploy after adding environment variables

### Prisma Schema Errors

**Solution**:
```bash
# Regenerate Prisma client locally
npm run db:generate --workspace=@invict/db

# Commit changes
git add -A
git commit -m "Regenerate Prisma client"
git push
```

---

## Ongoing Maintenance

### Update Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add/edit variables
3. Choose which environments (Production, Preview, Development)
4. Redeploy for changes to take effect

### Run Database Migrations

When you add new Prisma migrations:

```bash
# Create migration
npm run db:migrate --workspace=@invict/db

# Commit the migration files
git add packages/db/prisma/migrations
git commit -m "Add new migration"
git push

# Vercel will automatically run migrations via postinstall
```

---

## Support

For issues specific to Vercel deployment:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

For application-specific issues, check the main README.md

---

**🎉 Congratulations!** Your Invict Academy platform should now be live on Vercel.
