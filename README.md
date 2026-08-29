# M11 Snooker & Shisha Lounge

Premium black-and-gold website for **M11 Lounge** — customer storefront, online menu, cart, Paystack checkout, order tracking, and an admin dashboard.

## Run locally

```bash
cd "/Users/pro/Desktop/M11 "
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npx tsx prisma/seed-jobs.ts
npm run crop-images   # splits platter / sides / shisha photos
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin login

| Role | Email | Password |
|---|---|---|
| Owner | `admin@m11lounge.com` | `M11Admin2026!` |
| Staff | `staff@m11lounge.com` | `M11Admin2026!` |

Change these passwords after first login (Staff page, owner account).

Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

**STAFF** can view the dashboard and manage orders. **ADMIN** can also edit menu, promotions, and website copy. **SUPER_ADMIN** can manage staff accounts.

## Paystack

Add keys to `.env` (see `.env.example`):

- `PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_WEBHOOK_SECRET` (optional; falls back to the secret key)

Webhook URL: `https://your-domain.com/api/paystack/webhook`

Without keys, checkout still works as **Pay at the lounge**.

## Careers / recruitment

Applicants go to [/careers](http://localhost:3000/careers), pick a role, upload a CV, then sit Section A (general screening) plus the role section. They see **only total scores** after submit — not which items were right or wrong.

Admin: [/admin/applications](http://localhost:3000/admin/applications) — name, contact, CV, per-question marking, section scores, status, notes.

Reseed questionnaires without touching the restaurant menu:

```bash
npm run db:seed-jobs
```

## Promo codes (seeded)

- `WELCOME10` — 10% off
- `NIGHT5` — ₦5,000 off orders of ₦40,000+

Food prices that were not printed on the photos are placeholders and can be changed in **Admin → Menu**. Seafood platter and shisha prices match the printed menus.

## Deploy on Vercel (m11lounge.com)

This app needs **Postgres** (not SQLite) and **Blob storage** for CVs/images. Follow the walkthrough in chat, or:

1. Create a [Vercel](https://vercel.com/signup) account.
2. Add a [Neon](https://console.neon.tech) Postgres database (free) — or **Vercel → Storage → Neon**.
3. Add **Vercel Blob** (Storage → Blob).
4. Set environment variables (see `.env.example`).
5. Deploy, then run once: `npx prisma db push` and `npx tsx prisma/seed.ts && npx tsx prisma/seed-jobs.ts` with `DATABASE_URL` pointing at Neon.
6. Add domain `m11lounge.com` in Vercel after you buy it.

## Notes

- `Poundo Ham.jpg` and `Semo & Egusi soup.jpg` were identical files; both dishes currently share that photo. Upload a unique Poundo Ham image in admin when you have one.
- Combo platter uses a composite of the meat platter and seafood splender photos until you upload a dedicated shot.
