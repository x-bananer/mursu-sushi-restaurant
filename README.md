# Mursu Sushi Restaurant

**Mursu Sushi Restaurant** is a fullstack student project for the course **Web‑projekti TX00EY24-3012**.
This is a web application for a sushi restaurant: a client-facing site where users can browse the menu and place orders, with an admin panel for managing menu items, orders, and restaurant data.

## Evaluation and Support

If you are a developer and want to evaluate the project, please use the evaluation form:

https://forms.gle/3uTGABkuHVZcW7h2A

If you want to provide feedback, have questions or need help, please use this support form:

https://forms.gle/kPwvDc3ysCv5uBqy5

## Deployed application

Deployed app link:

TODO: add deployed frontend URL here

## Maintainers and contributors

Team #8

- Ksenia Shlenskaia
- Veikka Liukkonen
- Unna Postila
- Luara Moreira Da Silva

## Application idea and target audience

The application is a sushi restaurant website where a user can browse the menu, select dishes, build an order, pay online for it, and track its status. The main scenario is a fast and simple food ordering flow.

The system also includes an admin panel where restaurant staff can manage menu items, ingredients, orders, and their statuses.

Target audience:

* restaurant customers who want to order food online;
* restaurant staff managing orders and content via the admin interface.

## Application features

### Key features:

* for customers: browsing the menu, adding dishes to the cart (including custom sets), marking favorites, placing and paying for orders, tracking order status, building a route to the restaurant, managing a personal profile, and using a discount system;
* for restaurant staff: managing menu items and ingredients, setting a daily special, processing orders and updating their statuses in real time, managing customer data.

### Detailed functionality description by pages:


**Home page**

- short restaurant description;
- contacts;
- address and map;
- links to main sections (menu, combo-builder).

**Menu page**

- list of dishes from API;
- daily special with 10% discount;
- dish price and dietary badges;
- search and category filters;
- add to cart, update quantity, remove;
- mark as favorite (for authenticated users).

**Combo Builder page**

- list of ingredients from API;
- building a custom set;
- adding combo to cart.

**Login page**

- registration;
- login;
- login as user or admin.

**Cart page**

- cart persistence for guests and authenticated users;
- view, update quantity, and remove items;
- select delivery type and enter address;
- display total price and discounts;
- payment and checkout (for authenticated users only).

**Order tracker page**

- access only for authenticated users;
- real-time order status tracking;
- estimated preparation time;
- route building to the restaurant for different transport types.

**User profile page**

- access only for authenticated users;
- view and update user data (name, email, photo, password);
- view registration date;
- view number of stamps;
- view stamp rules (10% discount on every 6th order).

**Admin panel**

- manage dishes (create/update/delete);
- manage ingredients (create/update/delete);
- set daily special;
- manage orders and statuses;
- real-time status updates;
- view users.

## External API integrations

- **HSL / Digitransit**: public transport routing in the order tracker.
- **OpenRouteService**: car routing in the order tracker.
- **Stripe**: payment at checkout.

## Why this project is useful

- **For customers:**
  - clear menu with prices and dietary labels;
  - simple ordering flow with discount support (daily special, stamps);
  - real-time order tracking and route building.
- **For the restaurant:**
  - admin panel for managing menu, ingredients, and orders;
  - real-time status updates synced with the client;
  - tool for daily promotions (daily special).
- **For the development team:**
  - hands-on experience with fullstack architecture (React + Express.js + MySQL + REST);
  - working with real-time updates (SSE) and external APIs;
  - implementation of role-based logic and business rules.

## Application architecture and tech stack

- `frontend/` — SPA including user interface and admin panel
- `backend/` — REST API, business logic, integrations, SQL layer

### Frontend

- Node.js v24.14.0
- React 19
- React Router
- React Icons
- Vite
- CSS
- Leaflet / react-leaflet
- Stripe client SDK

### Backend

- Node.js v24.14.0
- Express
- MySQL (`mysql2`)
- JWT auth

Public API docs:
https://x-bananer.github.io/mursu-sushi-restaurant/

## Demo

A short demo video showing the main user flows (menu, cart, checkout, order tracking, admin panel) will be added here.

TODO: add demo video link (YouTube).

## Testing guide

You can test the application using the deployed version or by running it locally.

### Deployed version (recommended)

Open the deployed site:

TODO add a link here

After that, follow the instructions in [Testing](#testing).

### Local version (for developers)

Clone the repository and run the app in **two separate terminals**.

#### Environment variables

Create `.env` files from examples:

```bash
cd backend
cp .env.example .env

cd ../frontend
cp .env.example .env
```

Adjust values if needed (API keys, DB settings).

#### Backend

```bash
cd backend
nvm use
npm install
npm run db:setup
npm run dev
```

Backend runs at http://localhost:3000

#### Frontend

```bash
cd frontend
nvm use
npm install
npm run dev
```

Frontend runs at http://localhost:5173

After startup, continue with [Testing](#testing).

### Autonomous testing

Run backend integration tests from the `backend` app directory:

```bash
cd backend
npm install
npm run test:integration
```

This command runs the full integration suite (`tests/integration/*`): 6 suits, 18 tests.

### Manual testing

#### Core functionality

**User**

1. Open the home page and check description, contacts, and address.
2. Open `/menu` and verify that dishes are loaded from the API. Check that dishes available for today are displayed, and that dishes unavailable today are shown disabled at the bottom of the page.
3. Add any dish to the cart. Check that the daily special dish gets a 10% discount when added to the cart.
4. Verify price, dietary badges, search, sorting and filters in menu.
5. Open `/combo-builder`, build a combo using drag-and-drop (or mobile selection), change ingredient order, verify that a combo cannot be added without required structure (base/filling/topping), and then add it to cart.
6. Open `/auth`, register a new user.
7. Open `/cart`, select delivery type, enter address if needed, and test checkout:
   - cart data for failed payment: use `4000 0000 0000 0002` and verify error is shown and order is not created.
   - cart data for successful payment : use `4242 4242 4242 4242` and verify order is created;
8. After checkout, verify automatic redirect to `/order-tracker`.
9. Open `/user-profile`, update user data, and verify stamps increase after creating an order.

**Admin**

10. Go to /user-profile and log out using the Logout button. Then open /auth. Log in as an administrator using these credentials: `admin@test.com / Admin123!`. Alternatively, click “STAFF? ADMIN PANEL IS AT /ADMIN ↗” and register a new admin account (use `mursu` as the admin secret). 

11. Verify that after admin login you are redirected to /adm. Try opening regular customer pages and confirm they are not accessible while you are logged in as admin.

12. Go to /adm/orders and use the orders dashboard to process your order (change the order status from the order card). You can stay logged in as a customer in another browser window, create an order and watch /order-tracker update instantly as the admin changes statuses.

13.Go to /adm/menu and edit dishes or mark them as unavailable.
In another browser window, verify that these dish changes are reflected on the customer /menu page.

14. Go to /adm/special and change the special dish for today or other days.
In another browser window, verify that the special dish badge is updated on the customer /menu page.

15. Go to /adm/customers and apply a discount to a user or edit their stamp count.
In another browser window, verify for an authenticated customer that the stamp count has changed on /user-profile.

#### Responsiveness

16. Check responsiveness of all pages on desktop and mobile.

#### Localization

17. Switch the app language using the button in the header of the application and verify localization:
   - frontend UI texts are shown in the selected language;
   - backend error messages are shown in the selected language.

*Dish and ingredients names and their descriptions in the menu should remain in English.*

18. Switch the app theme using the button in the application header and verify that it changes from dark to light and back.

### Test accounts and data

- Admin: `admin@test.com` / `Admin123!`
- User: `user@test.com` / `User12345!`

- Failed payment: `4000 0000 0000 0002`, use any future date and any CVC.
- Successful payment: `4242 4242 4242 4242`, use any future date and any CVC.
