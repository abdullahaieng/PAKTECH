<<<<<<< HEAD
# PakTech — E-commerce Store + Admin Dashboard

Pakistan's premium tech accessories store with built-in admin panel on the same site.

## Quick Start

```bash
npm install
npm run dev
```

Store and admin both run on **http://localhost:3000**

## Admin Login

Sign in from the main website login page (`/account/login`):

- Email: `pktech190@gmail.com`
- Password: `admin123`

After login you are redirected to `/admin/dashboard`.

You can also go directly to `/admin` — you'll be sent to login if not authenticated.

Change credentials via `.env.local`:

```
ADMIN_EMAIL=pktech190@gmail.com
ADMIN_PASSWORD=admin123
ADMIN_SECRET=your-secret-key
```

## Architecture

```
paktech/
├── app/                    # Store frontend + admin UI + API routes
│   ├── admin/              # Admin dashboard (same port)
│   └── api/                # REST API (store + admin)
├── lib/
│   ├── admin/              # Admin client API + auth helpers
│   ├── db/                 # File store or Firestore
│   ├── services/           # Business logic
│   └── auth/               # Admin + user authentication
├── components/admin/       # Admin UI components
└── store/                  # Zustand client state
```

## Data Flow

1. **Store** places order → `POST /api/orders` → saves to database
2. **Admin** reads/manages via `/api/admin/*` endpoints
3. **Products** edited in admin → instantly reflect on store

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Store + admin on :3000 |
| `npm run build` | Build production |
| `npm run seed:firestore` | Seed Firestore (if enabled) |

## Coupon Codes

`PAKTECH10` · `WELCOME15` · `FLASH20`

## Deployment

- Use an environment provider (Vercel, Render, Netlify, etc.) and configure runtime env vars securely.
- Do not commit your real `.env.local` or Firebase service account JSON.
- For production, set `FIRESTORE_ENABLED=true` and provide either:
  - `FIREBASE_SERVICE_ACCOUNT_JSON` with the full service account JSON, or
  - `FIREBASE_SERVICE_ACCOUNT_PATH` pointing to a secure file path on the host.
- The `.env.example` file shows the expected variable names.

### Recommended deployment steps

1. Create a fresh repository without `secure/` or `.env.local` checked in.
2. Add your production Firebase values via the platform's secret environment variable UI.
3. Run `npm run check` locally and in CI.

## CI / Quality checks

A GitHub Actions workflow is included at `.github/workflows/ci.yml`.
It runs `npm ci`, `npm run lint`, and `npm run build` on pushes and pull requests.

## Legacy Admin App

The separate `admin/` folder (port 3001) is deprecated. Use `/admin` on the main site instead.
=======
# PAKTECH
e COM WEBSITE
>>>>>>> fc6cc85625f562379fce574bdc61dfb29a5f8f72
