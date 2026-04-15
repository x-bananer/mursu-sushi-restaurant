# DTO types

This folder contains DTOs for API responses.

DTO = Data Transfer Object.

DTO describes data in the shape the backend returns to the client.
It is not a copy of database tables. One DTO can combine data from multiple tables, omit internal fields, and include nested objects.

Files in this folder:

- `user.type.js` — user data for the client
- `dish.type.js` — dish data for menu and related responses
- `ingredient.type.js` — ingredient data for custom items
- `payment.type.js` — payment data for orders
- `order.type.js` — full order data, including items and payment
- `cart.type.js` — full cart data, including items and total price
- `admin.type.js` — TODO

Simple rule:
if a type describes data returned to the client, it belongs here.
