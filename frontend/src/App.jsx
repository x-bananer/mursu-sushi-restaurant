import { BrowserRouter, Routes, Route } from "react-router";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

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
import AuthShell from "./pages/customer/auth-shell/authShell";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin pages
import Admin from "./pages/adm/AdmPanel";
// Admin components navigation
import Customers from "./components/adm/customers/Customers";
import DailySpecial from "./components/adm/daily-special/DailySpecial";
import LiveOrders from "./components/adm/live-orders/LiveOrders";
import MenuEdit from "./components/adm/menu-edit/MenuEdit";
import AdmProfile from "./components/adm/AdmProfile";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					{/* CUSTOMER ROUTES */}
					<Route element={<CustomerLayout />}>
						<Route path="/" element={<Home />} />
						<Route path="/menu" element={<Menu />} />
						<Route path="/combo-builder" element={<ComboBuilder />} />
						<Route path="/cart" element={<Cart />} />
						<Route path="/auth" element={<AuthShell />} />
						<Route
							path="/order-tracker"
							element={
								<ProtectedRoute>
									<OrderTracker />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/user-profile"
							element={
								<ProtectedRoute>
									<UserProfile />
								</ProtectedRoute>
							}
						/>
					</Route>

					{/* ADMIN ROUTES */}
					<Route element={
						<ProtectedRoute adminOnly>
							<AdminLayout />
						</ProtectedRoute>
					}>
						<Route path="/adm" element={<Admin />} />
						<Route path="/adm/profile" element={<AdmProfile />} />
						<Route path="/adm/customers" element={<Customers />} />
						<Route path="/adm/special" element={<DailySpecial />} />
						<Route path="/adm/orders" element={<LiveOrders />} />
						<Route path="/adm/menu" element={<MenuEdit />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
