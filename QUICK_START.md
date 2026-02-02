# 🚀 Quick Start: Deploy to Vercel

Your `vercel-deployment` branch has been pushed to GitHub! Follow these steps to deploy:

## Step 1: Import to Vercel

Click this button to deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alijendoubi/Invict-Academy&project-name=invict-academy&repository-name=invict-academy&root-directory=apps/web&branch=vercel-deployment)

**Or manually:**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import: `alijendoubi/Invict-Academy`
3. Select branch: `vercel-deployment`
4. **Important**: Set **Root Directory** to `apps/web`

## Step 2: Configure Environment Variables

### Minimum Required (to get started)

```bash
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_random_secret_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Generate JWT Secret
```bash
openssl rand -base64 32
```

### Get a Free Database
- **Vercel Postgres**: Built-in, click "Storage" → "Create Database" → "Postgres"
- **Supabase**: [database.new](https://database.new) (free tier)
- **Neon**: [neon.tech](https://neon.tech) (generous free tier)
- **Railway**: [railway.app](https://railway.app) (free tier)

### Optional Services (can set `DEMO_MODE=true` to skip)

| Service | Variable | Get Free Key |
|---------|----------|--------------|
| Stripe | `STRIPE_SECRET_KEY` | [dashboard.stripe.com](https://dashboard.stripe.com) |
| OpenAI | `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com) |
| Resend | `RESEND_API_KEY` | [resend.com](https://resend.com) |
| Upstash Redis | `REDIS_URL` | [console.upstash.com](https://console.upstash.com) |

**Quick Demo Mode Setup:**
```bash
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
DEMO_MODE=true
```

## Step 3: Deploy!

Click **Deploy** and wait for the build to complete.

## Step 4: Run Database Migrations

After deployment, run migrations using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npm run db:migrate --workspace=@invict/db

# Optional: Seed database with sample data
npm run db:seed --workspace=@invict/db
```

## Step 5: Test Your Deployment

Visit your app at `https://your-app.vercel.app` and test:
- ✅ Homepage loads
- ✅ `/auth/login` works
- ✅ `/dashboard` accessible (after login)

---

## Need Help?

📖 **Full Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions

🔧 **Troubleshooting**: Check the troubleshooting section in DEPLOYMENT.md

📝 **Environment Variables**: See [.env.example](./.env.example) for all available options

---

**Repository**: https://github.com/alijendoubi/Invict-Academy  
**Branch**: `vercel-deployment`  
**Create PR**: https://github.com/alijendoubi/Invict-Academy/pull/new/vercel-deployment
