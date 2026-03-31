import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("adm-panel", "routes/AdmPanel.tsx"),
  route("order-tracker", "routes/OrderTracker.tsx"),
  route("user-profile", "routes/UserProfile.tsx"),
  route("menu", "routes/Menu.tsx"),
  route("combo-builder", "routes/ComboBuilder.tsx"),
  route("cart", "routes/Cart.tsx"),
  route("login", "routes/Login.tsx"),
] satisfies RouteConfig;