# No Poor Africa — Student Profile System

A database-backed web application for managing and showcasing student profiles for [No Poor Africa](https://nopoorafrica.org), a nonprofit investing in girls' education in Mozambique.

## What This System Does

**Two audiences, one database:**

1. **Public Profile Page** — A warm, photography-forward page showcasing each girl in the program. Designed to connect donors with the real people their support impacts.
2. **Admin Panel** — A private management interface where staff can add students, upload photos, record annual interview snapshots, and track each girl's journey from enrollment through graduation and beyond.

### Key Features

- **Dynamic age & grade tracking** — Age is computed from date of birth; grade advances automatically each year from enrollment data. No manual updates needed.
- **Annual snapshots** — Each year, staff add a new "snapshot" for each girl (interview story, photo, dream career, academic notes) without overwriting prior years. This builds a journey timeline.
- **Flexible data fields** — The `extraData` JSON column on snapshots lets you store new types of information (test scores, club memberships, etc.) without schema changes.
- **Image processing** — Photos are automatically resized to thumbnail (400x400) and full (800x1000) versions via Sharp, stored in Supabase Storage.
- **Privacy-first** — `is_public` toggle per student, `noindex` meta tags, academic notes hidden from public view.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 5 |
| Image Storage | Supabase Storage |
| Styling | Tailwind CSS |
| Auth | JWT (bcrypt password hashing) |
| Image Processing | Sharp |
| Hosting | Vercel |

## Deploy to Vercel + Supabase (Step-by-Step)

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free tier is plenty).
2. Click **New Project**, give it a name (e.g., `npa-students`), set a database password, and choose a region.
3. Wait for the project to finish provisioning (~2 minutes).

### Step 2: Get Your Supabase Credentials

From your Supabase Dashboard:

**Database connection strings** (Settings > Database > Connection string):
- Copy the **URI** — this is your `DATABASE_URL` (use the "Transaction" / port 6543 version for pooled connections)
- Copy the **Direct** URI — this is your `DIRECT_URL` (port 5432, used by Prisma for migrations)

**API keys** (Settings > API):
- Copy **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
- Copy **service_role key** (under "Project API keys") → this is `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Create the Storage Bucket

1. In Supabase Dashboard, go to **Storage** (left sidebar).
2. Click **New Bucket**.
3. Name it `student-photos`.
4. Toggle **Public bucket** to ON (so images can be displayed on the website).
5. Click **Create bucket**.

### Step 4: Run Database Migration

From your local machine:

```bash
# Clone and install
git clone <repo-url>
cd no-poor-student-profiles
npm install

# Create .env with your Supabase credentials
cp .env.example .env
# Edit .env — fill in DATABASE_URL, DIRECT_URL, NEXT_PUBLIC_SUPABASE_URL,
# SUPABASE_SERVICE_ROLE_KEY, and a strong JWT_SECRET

# Push the schema to your Supabase database
npx prisma migrate deploy

# Seed with sample data + admin user
npm run db:seed
```

### Step 5: Deploy to Vercel

1. Push this repo to GitHub (if not already).
2. Go to [vercel.com](https://vercel.com) and sign up / log in.
3. Click **Add New Project** → Import your GitHub repository.
4. Under **Environment Variables**, add all 6 variables from your `.env`:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | `postgresql://postgres.[ref]:[pw]@...pooler.supabase.com:6543/postgres?pgbouncer=true` |
   | `DIRECT_URL` | `postgresql://postgres.[ref]:[pw]@...pooler.supabase.com:5432/postgres` |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://[ref].supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` |
   | `JWT_SECRET` | (a random string — use a password generator) |

5. Click **Deploy**. Vercel will build and deploy automatically.

### Step 6: Embed in Squarespace

Once deployed, your Vercel URL (e.g., `https://npa-students.vercel.app`) can be embedded in your Squarespace site:

**Option A — Subdomain (recommended):**
1. In Vercel, add a custom domain: `girls.nopoorafrica.org`
2. In your DNS provider, add a CNAME record: `girls` → `cname.vercel-dns.com`
3. Link to it from your main Squarespace navigation

**Option B — Embed block:**
1. In Squarespace, add a **Code Block** (or Embed Block) to a page
2. Paste: `<iframe src="https://npa-students.vercel.app" width="100%" height="800" frameborder="0"></iframe>`

## Local Development

```bash
# Install dependencies
npm install

# Create .env with your Supabase credentials
cp .env.example .env

# Run migrations against your Supabase DB
npx prisma migrate deploy

# Seed the database
npm run db:seed

# Start dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Default Admin Credentials

- **Username:** `admin`
- **Password:** `nopoorafrica2025`

Change these in `.env` before seeding.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Public profile card grid
│   ├── students/[id]/page.tsx            # Public student detail page
│   ├── admin/
│   │   ├── login/page.tsx                # Admin login
│   │   ├── page.tsx                      # Admin student list/dashboard
│   │   └── students/
│   │       ├── new/page.tsx              # Add new student form
│   │       └── [id]/
│   │           ├── page.tsx              # Student detail/edit
│   │           └── snapshot/page.tsx     # Annual snapshot form
│   └── api/
│       ├── students/                     # Public read-only endpoints
│       └── admin/                        # Protected CRUD endpoints
├── components/
│   ├── StudentCard.tsx                   # Profile card for grid view
│   ├── FilterBar.tsx                     # Status filter + search
│   ├── JourneyTimeline.tsx               # Year-by-year journey display
│   └── PhotoGallery.tsx                  # Lightbox photo gallery
└── lib/
    ├── prisma.ts                         # Prisma client singleton
    ├── supabase.ts                       # Supabase client for storage
    ├── auth.ts                           # JWT auth utilities
    ├── computed.ts                       # Age/grade computation
    └── images.ts                         # Image upload + Sharp processing
```

## API Endpoints

### Public (no auth required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/students` | GET | All public students. Query: `?status=active` |
| `/api/students/:id` | GET | Full profile with snapshots & gallery |
| `/api/students/:id/snapshots` | GET | All annual snapshots (chronological) |

### Admin (JWT required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/auth` | POST | Login (returns JWT) |
| `/api/admin/auth/logout` | POST | Logout (clears cookie) |
| `/api/admin/students` | GET | All students (public + private) |
| `/api/admin/students` | POST | Create new student |
| `/api/admin/students/:id` | GET | Full student detail |
| `/api/admin/students/:id` | PUT | Update student fields |
| `/api/admin/students/:id` | DELETE | Soft-delete (sets withdrawn) |
| `/api/admin/students/:id/photo` | POST | Upload profile photo (multipart) |
| `/api/admin/students/:id/snapshots` | POST | Add annual snapshot (multipart) |
| `/api/admin/students/:id/gallery` | POST | Upload gallery photo (multipart) |

## Environment Variables

| Variable | Description | Where to find it |
|----------|-------------|------------------|
| `DATABASE_URL` | Pooled PostgreSQL connection string | Supabase > Settings > Database > Connection string (port 6543) |
| `DIRECT_URL` | Direct PostgreSQL connection string | Supabase > Settings > Database > Connection string (port 5432) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase > Settings > API > Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase > Settings > API > service_role key |
| `JWT_SECRET` | Secret for signing admin JWT tokens | Generate a random string |
| `ADMIN_SEED_USERNAME` | Initial admin username for seeding | Your choice |
| `ADMIN_SEED_PASSWORD` | Initial admin password for seeding | Your choice |

## Design & Branding

The public pages follow No Poor Africa's brand identity:

| Element | Value |
|---------|-------|
| Primary Green | `#2D6A4F` |
| Light Green | `#40916C` |
| Accent | `#D4A373` |
| Background | `#FAFAF8` (warm cream) |
| Typography | Inter (sans-serif) |
| Cards | White, 12px radius, soft shadow |

## Future Phases

Architectural decisions have been made to support these future additions without major rework:

- Donor sponsorship matching (follow a specific girl)
- Newsletter auto-generation from annual snapshots
- Multi-language admin interface (Portuguese)
- Impact reporting dashboard
- Alumni career tracking
- Mobile admin app for field interviews
