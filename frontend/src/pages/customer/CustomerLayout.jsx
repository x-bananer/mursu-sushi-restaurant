import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import Navbar from "../../components/customer/nav/Navbar";
import BottomNav from "../../components/customer/nav/BottomNav";
import Footer from "../../components/shared/footer/Footer";

import { CartProvider } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

export default function CustomerLayout() {
	const [isLightTheme, setIsLightTheme] = useState(
		() => localStorage.getItem("theme") === "light",
	);

	useEffect(() => {
		document.documentElement.classList.toggle("light-theme", isLightTheme);

		localStorage.setItem("theme", isLightTheme ? "light" : "dark");

		return () => {
			document.documentElement.classList.remove("light-theme");
		};
	}, [isLightTheme]);

	const { user } = useAuth();

	if (user?.role_id === 2) {
		return <Navigate to="/adm" replace />;
	}

	return (
		<CartProvider>
			<>
				<header className="header">
					<Navbar
						onToggleTheme={() => setIsLightTheme((prev) => !prev)}
					/>
				</header>

				<main className="layout page">
					<Outlet />
				</main>

				<Footer />
				<BottomNav />
			</>
		</CartProvider>
	);
}
