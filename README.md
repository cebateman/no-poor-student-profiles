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
- **Image processing** — Photos are automatically resized to thumbnail (400x400) and full (800x1000) versions on upload.
- **Privacy-first** — `is_public` toggle per student, `noindex` meta tags, academic notes hidden from public view.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | SQLite (dev) / PostgreSQL (production) |
| ORM | Prisma 5 |
| Styling | Tailwind CSS |
| Auth | JWT (bcrypt password hashing) |
| Image Processing | Sharp |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd no-poor-student-profiles

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env with your settings

# 4. Run database migration
npm run db:migrate

# 5. Seed the database with sample data + admin user
npm run db:seed

# 6. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Default Admin Credentials

- **Username:** `admin`
- **Password:** `nopoorafrica2025`

Change these in `.env` before seeding, or update the password in the admin panel after first login.

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

## Database Schema

### students
Core record for each girl — permanent data that rarely changes.

### annual_snapshots
One row per girl per year. Captures her story, photo, dream career, and academic info. The `extraData` JSON column provides unlimited flexibility for new fields.

### media_gallery
Additional photos beyond the profile and snapshot photos.

### admin_users
Staff login credentials.

## Deployment

### Squarespace Integration

The public profile page is designed to be embedded in Squarespace via:
- **HTML embed block** pointing to the hosted URL
- **Subdomain** (e.g., `girls.nopoorafrica.org`) with CNAME to hosting provider

### Recommended Production Setup

1. **Database:** Switch to PostgreSQL (update `provider` in `prisma/schema.prisma` and `DATABASE_URL` in `.env`)
2. **Hosting:** Vercel (frontend + API) or Railway/Render
3. **Image Storage:** Migrate from local filesystem to Cloudflare R2 or AWS S3
4. **CDN:** CloudFront or Cloudflare in front of image storage
5. **Auth:** Set a strong `JWT_SECRET` in production environment

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Database connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `ADMIN_SEED_USERNAME` | Initial admin username |
| `ADMIN_SEED_PASSWORD` | Initial admin password |

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
