import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // CUSTOMER LAYOUT
  route("", "routes/customer/layout.tsx", [
    index("routes/customer/home.tsx"),
    route("menu", "routes/customer/Menu.tsx"),
    route("combo-builder", "routes/customer/ComboBuilder.tsx"),
    route("cart", "routes/customer/Cart.tsx"),
    route("login", "routes/Login.tsx"),
    route("order-tracker", "routes/customer/OrderTracker.tsx"),
    route("user-profile", "routes/customer/UserProfile.tsx"),
  ]),

  // ADMIN LAYOUT
  route("adm", "routes/adm/layout.tsx", [
    route("panel", "routes/adm/AdmPanel.tsx"),
  ]),
] satisfies RouteConfig;
