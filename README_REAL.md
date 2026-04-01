# Mursu

A full-stack sushi restaurant application featuring a custom combo builder, cart and payment flow, real-time order tracking, and an admin panel for live order management, menu editing, and daily specials configuration.

## Core requirements

- [ ] Restaurant web application with an order / pickup system
- [ ] Frontend implemented using JavaScript or React (ES6+)
- [ ] Backend implemented using Node.js and Express
- [ ] SQL database (no hardcoded data)
- [ ] RESTful API with clear endpoint structure

## Main functionality

- [ ] Menu page with items loaded from a custom API (JSON)
- [ ] Highlighting of today’s special or daily menu
- [ ] Price display for all items
- [ ] Support for dietary information (vegan, gluten-free, lactose-free)

### User functionality:
- [ ] Registration and login
- [ ] Shopping cart
- [ ] Order placement

### Admin panel:
- [ ] Admin authentication
- [ ] Menu management (create / update / delete)
- [ ] Order management and status updates

### Additional features:
- [ ] Custom combo builder
- [ ] Real-time order tracking
- [ ] User profile and reward system

## Additional requirements

- [ ] Responsive design (mobile and desktop)
- [ ] Clean and structured UI/UX
- [ ] Multilingual support (Finnish / English)
- [ ] Integration with external API (e.g. HSL)
- [ ] Subtle animations and polished interface

## Quality requirements

- [ ] Clear project structure (frontend / backend / database separation)
- [ ] Proper API handling (loading / error states)
- [ ] Valid HTML and CSS
- [ ] Code documentation (JSDoc / ApiDoc)

## Testing:
- [ ] At least 5 integration tests
- [ ] At least 5 end-to-end tests

## Deployment

- [ ] The application must be deployed online (e.g. Vercel, Azure, eCloud)

## Getting Started

- Install dependencies:
``` npm install ```

- Start react vite dev server with hot reload:
``` npm run dev ```

- Building for Production:
``` npm run build ```

- Deploy using Docker or any Node.js hosting platform::
``` 
docker build -t mursu-sushi-restaurant . 
docker run -p 3000:3000 mursu-sushi-restaurant 
```

## Core Project Structure

```
src/
 ├─ routes/           # All page route modules.
 ├─ components/       # Shared & page-specific UI components with it's css files.
 ├─ hooks/            # Custom hooks for local API/data state management - works as local controllers.
 ├─ context/          # Global state (Auth, Cart, Language...) - works as global controllers.
 ├─ services/         # API services (menu, orders, auth...).
 ├─ app.css           # For global styles (Tailwind or CSS).
 ├─ root.tsx          # App root layout component with React Router v7 setup.
 └─ routes.tsx        # Route configuration.
 ```