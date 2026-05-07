import { Navigate, Outlet } from "react-router";
import Navbar from "../../components/customer/nav/Navbar";
import BottomNav from "../../components/customer/nav/BottomNav";
import Footer from "../../components/shared/footer/Footer";

import { CartProvider } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

export default function CustomerLayout() {
	const { user } = useAuth();

	if (user?.role_id === 2) {
		return <Navigate to="/adm" replace />;
	}

	return (
		<CartProvider>
			<header className="header">
				<Navbar />
			</header>

			<main className="layout page">
				<Outlet />
			</main>

			<Footer />
			<BottomNav />
		</CartProvider>
	);
}
