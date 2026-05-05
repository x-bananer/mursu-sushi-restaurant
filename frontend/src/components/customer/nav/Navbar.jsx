import React from "react";
import { Link, useLocation } from "react-router";
import NavBase from "../../shared/nav/NavBase";
import { UserIcon, CartIcon } from "../../shared/nav/icons";
import { useCartContext } from "../../../hooks/contextHooks/cart";

const Logo = () => (
	<Link to="/" className="nav__logo">
		<span className="nav__logo-letter nav__logo-letter--1">
			<span className="nav__logo-face">Mu</span>
			<span className="nav__logo-back">ム</span>
		</span>
		<span className="nav__logo-letter nav__logo-letter--2">
			<span className="nav__logo-face">r</span>
			<span className="nav__logo-back">ル</span>
		</span>
		<span className="nav__logo-letter nav__logo-letter--3">
			<span className="nav__logo-face">su</span>
			<span className="nav__logo-back">ス</span>
		</span>
	</Link>
);

export default function CustomerNavbar() {
	const location = useLocation();
	const [language, setLanguage] = React.useState("fi");

	const { cartItemsCount } = useCartContext();

	return (
		<NavBase
			left={[
				{
					to: "/menu",
					content: "MENU",
					isActive: location.pathname === "/menu",
				},
				{
					to: "/combo-builder",
					content: "BUILD A SET",
					isActive: location.pathname === "/combo-builder",
				},
			]}
			center={<Logo />}
			right={[
				{ to: "/user-profile", content: <UserIcon />, isIcon: true },
				{ to: "/cart", content: <CartIcon />, isIcon: true },
			]}
			extraRight={
				<button
					className="nav__link"
					type="button"
					onClick={() =>
						setLanguage((l) => (l === "en" ? "fi" : "en"))
					}
				>
					🇫🇮 {language.toUpperCase()}
				</button>
			}
			badge={cartItemsCount}
		/>
	);
}
