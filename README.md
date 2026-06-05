# PakTech — E-commerce Store + Admin Dashboard

Pakistan's premium tech accessories store with separate admin panel.

## Quick Start

```bash
# Store (port 3000)
npm install
npm run dev

# Admin (port 3001) — store must be running first
cd admin && npm install && npm run dev
```

## Default Admin Login

- Email: `admin@paktech.pk`
- Password: `admin123`

Change via `.env.local` (see `.env.example`).

## Architecture

```
paktech/
├── app/                    # Store frontend + API routes
│   └── api/                # REST API (store + admin)
├── admin/                  # Separate admin dashboard app
├── lib/
│   ├── db/file-store.ts    # Data layer (swap for Prisma/Drizzle)
│   ├── services/           # Business logic
│   └── auth/               # Admin authentication
├── data/
│   ├── products.ts         # Seed data
│   └── store-db.json       # Runtime data (auto-created, gitignored)
└── store/                  # Zustand client state
```

## Data Flow

1. **Store** places order → `POST /api/orders` → saves to `store-db.json`
2. **Admin** reads/manages via `/api/admin/*` endpoints
3. **Products** edited in admin → instantly reflect on store

## Database Migration (Next Step)

Replace `lib/db/file-store.ts` with Prisma/Drizzle repository.
All services (`lib/services/*`) stay the same — only the db layer changes.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Store on :3000 |
| `npm run dev:admin` | Admin on :3001 |
| `npm run build` | Build store |
| `npm run build:admin` | Build admin |

## Coupon Codes

`PAKTECH10` · `WELCOME15` · `FLASH20`
