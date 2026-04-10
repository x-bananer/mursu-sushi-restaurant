import { BrowserRouter, Routes, Route } from "react-router";

import CustomerLayout from "./pages/customer/layout";
import AdminLayout from "./pages/adm/layout";

import Home from "./pages/customer/Home";
import Menu from "./pages/customer/Menu";
import ComboBuilder from "./pages/customer/ComboBuilder";
import Cart from "./pages/customer/Cart";
import OrderTracker from "./pages/customer/OrderTracker";
import UserProfile from "./pages/customer/UserProfile";

import Login from "./pages/Login";

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
