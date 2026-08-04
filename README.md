# Yoruba Students' Union (YOSU) Enterprise Digital Portal
**Chapter:** Federal University Dutse (FUD) Chapter  
**Motto:** *"Ìpínlẹ̀ Ọmọ Oòduà: Ìfẹ̀ Sówapọ"*  

---

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the public site.

---

## Executive Portal & Developer Authentication

The Executive Administration CMS is accessible exclusively via direct navigation to the secure login route:

```
http://localhost:3000/login
```

> **Security Note**: Public navigation elements do NOT expose links to the executive administration interface. Access requires direct URL entry.

### Seeded Developer Credentials

For local development and testing, the database seeder initializes the following accounts:

| Role | Email | Default Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Administrator** | `admin@yosu.fud.edu.ng` | `AdminPassword2026!` | Unrestricted System & Audit Access |
| **President** | `president@yosu.fud.edu.ng` | Defined via Admin | Executive Officer |
| **Speaker of the House** | `speaker@yosu.fud.edu.ng` | Defined via Admin | Legislative Officer |

---

## Database Management & Seeding

```bash
# Push Prisma Schema to SQLite
npx prisma db push

# Run Database Seeder
npx tsx prisma/seed.ts
```

---

## Production Build & Type Checking

```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Build production application
npm run build
```
