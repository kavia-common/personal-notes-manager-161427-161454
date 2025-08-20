# Notes Frontend (Next.js)

A minimalistic, responsive light-themed frontend for a personal notes manager. Features:
- User authentication (Sign in / Sign up)
- Create, edit, delete notes
- List and search notes
- Sidebar navigation with main notes/editor area
- REST API calls to backend (notes_database)
- Environment variable-based configuration

## Quick Start

1) Install dependencies:
   npm install

2) Configure environment variables:
   Create a `.env.local` file and set:
   - NEXT_PUBLIC_API_BASE_URL=<url to notes_database backend>

See `.env.example` for reference.

3) Run the development server:
   npm run dev
   Open http://localhost:3000

## Environment Variables

- NEXT_PUBLIC_API_BASE_URL: Base URL for the backend notes API, e.g.:
  https://api.example.com

## API Expectations

The frontend expects the backend to expose endpoints:
- POST /auth/signup { email, password } -> { token, user }
- POST /auth/login { email, password } -> { token, user }
- GET /auth/me -> { id, email }
- GET /notes?q=optional -> Note[]
- POST /notes { title, content } -> Note
- PUT /notes/:id { title, content } -> Note
- DELETE /notes/:id -> 204

Authorization should use `Authorization: Bearer <token>`.

## Design

Color scheme:
- Primary: #2563eb
- Secondary: #64748b
- Accent: #f59e42

Layout:
- Sidebar with navigation (Home, Auth)
- Main area: notes list + editor
- Minimalistic light theme

## Build and Export

- Development: npm run dev
- Production build: npm run build
- Start: npm run start

