import React from "react";
import { useLocation } from "react-router";
import NavBase from "~/components/shared/nav/NavBase";
import { UserIcon, CartIcon } from "~/components/shared/nav/icons";

const Logo = () => (
  <a href="/" className="nav__logo">
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
  </a>
);

export default function CustomerNavbar() {
  const location = useLocation();
  const [language, setLanguage] = React.useState<"en" | "fi">("fi");

  return (
    <NavBase
      left={[
        { to: "/menu", content: "MENU", isActive: location.pathname === "/menu" },
        { to: "/combo-builder", content: "BUILD A SET", isActive: location.pathname === "/combo-builder" },
      ]}
      center={<Logo />}
      right={[
        { to: "/login", content: <UserIcon />, isIcon: true },
        { to: "/cart",  content: <CartIcon />,  isIcon: true },
      ]}
      extraRight={
        <button className="nav__link" type="button" onClick={() => setLanguage(l => l === "en" ? "fi" : "en")}>
          🇫🇮 {language.toUpperCase()}
        </button>
      }
    />
  );
}
