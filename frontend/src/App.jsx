import { BrowserRouter, Routes, Route } from "react-router";

// Layouts
import CustomerLayout from "./pages/customer/CustomerLayout";
import AdminLayout from "./pages/adm/AdminLayout";

// Customer pages
import Home from "./pages/customer/home/Home";
import Menu from "./pages/customer/menu/Menu";
import ComboBuilder from "./pages/customer/combo/ComboBuilder";
import Cart from "./pages/customer/cart/Cart";
import OrderTracker from "./pages/customer/order-tracker/OrderTracker";
import UserProfile from "./pages/customer/user-profile/UserProfile";
import Login from "./pages/customer/login/Login";

// Admin pages
import Admin from "./pages/adm/AdmPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* CUSTOMER ROUTES */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/combo-builder" element={<ComboBuilder />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/order-tracker" element={<OrderTracker />} />
          <Route path="/user-profile" element={<UserProfile />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<AdminLayout />}>
          <Route path="/adm" element={<Admin />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
