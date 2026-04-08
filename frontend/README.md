# 🍣 Mursu Sushi Restaurant

A modern sushi restaurant web app built with React Router, featuring separate customer and admin experiences.

---

## 🚀 Features

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
│ ├── shared/
│ │ └── nav/
│ │     ├── NavBase.tsx
│ │     ├── BottomNavBase.tsx
│ │     ├── icons.tsx
│ │     └── nav.css
│ │ └── loading.tsx
│ │ └── modal.tsx
│ │ └── any other component used in multiple pages.
│ │ 
│ ├── customer/
│ │ └── nav/
│ │     └── BottomNav.tsx
│ │     └── NavBar.tsx
│ │ └── order-tracker/
│ │ └── Most likely each page will have its own folder with its unique componentes and styles.
│ │
│ └── adm/
│ │ └── nav/
│ │     └── AdmBottomNav.tsx
│       ├── AdmNavbar.tsx
│       └── AdmSideNav.tsx
|
│ │ └── live-orders/
│ │ └── menu-editor/
│ │ └── customers/
│ │ └── settings/
│ │ └── reviews/
│ │ └── form/
│
├── routes/
│ ├── customer/
│ └── adm/
│
├── routes.ts
└── root.tsx 
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

---
