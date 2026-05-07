import React from "react";
import { Link, useLocation } from "react-router";
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineSun } from "react-icons/hi2";
import NavBase from "../../shared/nav/NavBase";
import { useCartContext } from "../../../hooks/contextHooks/cart";
import { useAuth } from "../../../contexts/AuthContext";

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

export default function CustomerNavbar({ onToggleTheme }) {
	const location = useLocation();
	const [language, setLanguage] = React.useState(
		localStorage.getItem("locale") || 'en',
	);
	const languageFlag = language === "fi" ? "🇫🇮" : "🇬🇧";

	const { cartItemsCount } = useCartContext();
	const { user } = useAuth();

	const userLinkContent = user?.photo_url ? (
		<img 
			src={user.photo_url} 
			alt="User Profile" 
			className="nav__avatar-img"
		/>
	) : (
		<HiOutlineUser size={20} />
	);

	const rightItems = [
		{ 
			to: user ? "/user-profile" : "/auth", 
			content: userLinkContent, 
			isIcon: !user?.photo_url 
		},
		{ 
			to: "/cart", 
			content: <HiOutlineShoppingBag size={20} />, 
			isIcon: true 
		},
	];

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
			right={rightItems}
			extraRight={
				<>
					<button
						className="nav__link nav__theme-toggle"
						type="button"
						onClick={onToggleTheme}
						aria-label="Toggle theme"
						title="Toggle theme"
					>
						<HiOutlineSun size={24} />
					</button>
					<button
						className="nav__link"
						type="button"
						onClick={() =>
							setLanguage((l) => {
								const newLocale = l === "en" ? "fi" : "en";
								localStorage.setItem("locale", newLocale);
								return newLocale;
							})
						}
					>
						{languageFlag} {language.toUpperCase()}
					</button>
				</>
			}
			badge={cartItemsCount}
		/>
	);
}
