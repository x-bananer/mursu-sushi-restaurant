import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Navbar from "../../components/customer/nav/Navbar";
import BottomNav from "../../components/customer/nav/BottomNav";
import Footer from "../../components/shared/footer/Footer";

import { CartProvider } from "../../contexts/CartContext";

export default function CustomerLayout() {
	const [isLightTheme, setIsLightTheme] = useState(() => localStorage.getItem("theme") === "light",);

	useEffect(() => {
		document.documentElement.classList.toggle("light-theme", isLightTheme);

		localStorage.setItem("theme", isLightTheme ? "light" : "dark");

		return () => {
			document.documentElement.classList.remove("light-theme");
		};

	}, [isLightTheme]);

	return (
		<CartProvider>
			<>
				<header className="header">
					<Navbar
						isLightTheme={isLightTheme}
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
