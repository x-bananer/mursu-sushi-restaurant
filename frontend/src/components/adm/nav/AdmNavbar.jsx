import { Link } from "react-router";
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
	return (
		<NavBase
			center={<Logo />}
			right={[
				{ to: "/user-profile", content: <UserIcon />, isIcon: true },
			]}
		/>
	);
}
