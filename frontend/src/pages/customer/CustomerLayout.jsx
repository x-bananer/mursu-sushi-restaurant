import { Outlet } from "react-router";
import Navbar from "../../components/customer/nav/Navbar";
import BottomNav from "../../components/customer/nav/BottomNav";
import Footer from "../../components/shared/footer/Footer";

import { CartProvider } from "../../contexts/CartContext";

export default function CustomerLayout() {
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
