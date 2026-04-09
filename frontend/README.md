# 🍣 Mursu Sushi Restaurant - Frontend

A modern, responsive sushi restaurant web application built with React Router. Designed to simulate a real-world restaurant system with a modular, scalable component architecture.
---

## Features

### Customer
- Browse menu
- Build custom combos
- Cart & checkout
- Order live tracker
- Optional user account for rewards and saving favorits.
- Responsive navigation (top + bottom nav)

### Admin
- Dashboard
- Live orders
- Menu editor
- Customer management
- Sidebar navigation + mobile bottom nav

---

## 🧱 Project Structure
```
app/
├── components/
│
│   ├── shared/                # Reusable across entire app
│   │   ├── nav/               # Base navigation system
│   │   │   ├── NavBase.tsx
│   │   │   ├── BottomNavBase.tsx
│   │   │   ├── icons.tsx
│   │   │   └── nav.css
│   │   ├── loading.tsx
│   │   ├── modal.tsx
│   │   └── ...other shared UI
│
│   ├── customer/             # Customer-specific UI
│   │   ├── nav/
│   │   │   ├── NavBar.tsx
│   │   │   └── BottomNav.tsx
│   │   ├── order-tracker/
│   │   └── ... the remaining pages
│
│   └── adm/                  # Admin-specific UI
│       ├── nav/
│       │   ├── AdmNavbar.tsx
│       │   ├── AdmBottomNav.tsx
│       │   └── AdmSideNav.tsx
│       ├── live-orders/
│       ├── menu-editor/
│       ├── customers/
│       ├── reviews/
│       ├── settings/
│       └── form/
│
├── routes/                   # Route definitions split by role
│   ├── customer/
│   └── adm/
│
├── routes.ts                 # Central route configuration
└── root.tsx                  # App root (layout + providers)

public/
```

## 📦 Tech Stack

- React
- React Router
- TypeScript
- CSS (custom, no framework)

## Design Decisions

- Split layouts instead of role-checking (isAdmin)
- Reusable nav components instead of duplicated HTML
- Centralized icons for consistency
- Responsive-first navigation (bottom nav on mobile)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

📌 Future Implementations
- Authentication & authorization context layer
- HTML pages refactor into modularized react components
- Backend API integration
- Real-time updates via WebSockets
- Testing (unit + integration)
---

Building with ❤️ for clean code and great sushi.
