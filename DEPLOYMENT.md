Deployment checklist and environment variables

Required environment variables (production):

- AUTH_SECRET: a strong random string used for session signing
- NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, NEXT_PUBLIC_FIREBASE_APP_ID, NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  (Firebase client-side config for auth and session sync)
- FIRESTORE_ENABLED=true (enables Firestore as the main data store for users, orders, and admin-managed store content)
- FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON (server-side Firebase admin credentials)
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- ADMIN_EMAIL
- ADMIN_PASSWORD
- ADMIN_SECRET (used to sign admin tokens)

Optional / recommended:
- SMTP host/port/credentials for order confirmations (e.g. SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
- PAYMENT_PROVIDER (e.g. stripe) and API keys (STRIPE_SECRET_KEY) — note: card payment gateway is not wired in the current project, so orders are expected to use Cash-on-Delivery or a custom payment flow.
- RATE_LIMITING settings (e.g. REDIS_URL for distributed rate limiting)
- SENTRY_DSN or other error tracking
- NODE_ENV=production

Example SMTP configuration (recommended for production email delivery):

- `SMTP_HOST` — e.g. `smtp.sendgrid.net` or your provider host
- `SMTP_PORT` — e.g. `587` (TLS) or `465` (SSL)
- `SMTP_USER` — SMTP username
- `SMTP_PASS` — SMTP password
- `EMAIL_FROM` — optional friendly from address, e.g. `noreply@yourdomain.com`

Notes about admin secrets:

- The app requires `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SECRET` in production. The startup will fail if these are missing in `NODE_ENV=production` to prevent accidental exposure of admin features.
- For local development you can set these in `.env.local`, but do not commit credentials to the repo.

Security recommendations:

- Use your cloud provider or CI secret store for `FIREBASE_SERVICE_ACCOUNT` and other secrets instead of committing JSON files.
- Configure `REDIS_URL` for distributed rate limiting in production and update the rate limiter implementation to use Redis.

Security notes & gaps to fix before production:

- Do not keep service account files in the repo. Use your cloud provider's secret manager or CI secrets.
- Ensure `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SECRET` are set in environment (the project now refuses to create/verify admin tokens if `ADMIN_SECRET` is missing).
- Implement a payment gateway (Stripe or PayPal) for card payments — the project currently supports Cash-on-Delivery and a `card` option in types, but no gateway is integrated.
- Configure and test email sending (order confirmations, password reset). Currently no SMTP/email provider is configured.
- Add rate limiting / brute-force protection to auth endpoints (login, password reset).
- Add logging and alerting (Sentry/Datadog) for production error visibility.
- Replace placeholder images (picsum.photos) with Cloudinary-hosted product images uploaded via admin UI.
- Ensure CI/CD secrets are configured in GitHub Actions / your deployment platform instead of hardcoding.

Deployment steps (quick):

1. Provision Firebase project and create a service account. Store the JSON in your provider's secrets and set `FIREBASE_SERVICE_ACCOUNT_PATH` or load via env.
2. Provision Cloudinary account and set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
3. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SECRET` as secrets.
4. (Optional) Provision a payment provider and SMTP provider and set their secrets.
5. Build and deploy the Next.js app using Vercel/Netlify/Custom server.

If you want, I can:
- Wire basic Stripe checkout flow for products.
- Add SMTP email send for orders using `nodemailer` or a transactional provider.
- Add rate limiting middleware and basic tests.

Next I will mark the folder-structure doc step complete and proceed to run automated static checks (TypeScript build & ESLint) to gather any remaining errors. If that's OK, I'll run `npm run build` now.
