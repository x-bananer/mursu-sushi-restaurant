# Controller types

This folder contains types for controller API contracts.

These are not DTOs and not database types.
This is where we describe what an endpoint accepts and what it returns:

- `Request` — input data
- `Response` — endpoint response

Files in this folder:

- `auth.type.js` — register, login, logout, get current user, update current user
- `user.type.js` — manage favorite dishes for current user
- `dish.type.js` — menu dish list and daily special
- `order.type.js` — create, list, get, delete, and track orders
- `cart.type.js` — get cart, create cart, update cart
- `admin.type.js` — TODO

Simple rule:
if a type belongs to a specific endpoint, it belongs here.
If a type is reused in responses as a data object, it belongs in `dto/`.
