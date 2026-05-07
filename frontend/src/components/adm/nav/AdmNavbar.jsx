import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import NavBase from "../../shared/nav/NavBase";
import { UserIcon } from "../..//shared/nav/icons";

const Logo = () => (
	<Link to="/adm" className="nav__logo">
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

export default function AdminNavbar() {
	const { i18n } = useTranslation();
	const language = i18n.resolvedLanguage === "fi" ? "fi" : "en";
	const languageFlag = language === "fi" ? "🇫🇮" : "🇬🇧";

	return (
		<NavBase
			center={<Logo />}
			right={[
				{ to: "/adm/profile", content: <UserIcon />, isIcon: true },
			]}
			extraRight={
				<button
					className="nav__link"
					type="button"
					onClick={() => {
						const newLocale = language === "en" ? "fi" : "en";
						localStorage.setItem("locale", newLocale);
						i18n.changeLanguage(newLocale);
					}}
				>
					{languageFlag} {language.toUpperCase()}
				</button>
			}
		/>
	);
}
