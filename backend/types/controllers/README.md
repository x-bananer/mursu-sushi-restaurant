# Controller types

This folder contains types for controller API contracts.

These are not DTOs and not database types.
This is where we describe what an endpoint accepts and what it returns:

- `Request` — input data
- `Response` — endpoint response

Files in this folder:

- `auth.type.js` — login, register, logout, get current user, update current user
- `user.type.js` — manage favorite dishes
- `dish.type.js` — dish list and daily special
- `order.type.js` — create order and get order
- `admin.type.js` — TODO
- `cart.type.js` — TODO

Simple rule:
if a type belongs to a specific endpoint, it belongs here.
If a type is reused in responses as a data object, it belongs in `dto/`.
