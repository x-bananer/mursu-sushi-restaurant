import React from "react";
import { Link, useLocation } from "react-router";

export default function Navbar() {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  // FI/EN toggle
  const [language, setLanguage] = React.useState<"en" | "fi">("en");
  const toggleLanguage = () => setLanguage(prev => (prev === "en" ? "fi" : "en"));

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        {!isAdmin && (
          <>
            <Link to="/menu" className="nav-link">
              🍱 Menu
            </Link>
            <Link to="/combo-builder" className="nav-link">
              🥢 Build Combo
            </Link>
          </>
        )}
      </div>

      {/* CENTER */}
      <div className="nav-center">
        <Link to="/" className="logo">Mursu</Link>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        {/* FI/EN toggle */}
        <button onClick={toggleLanguage} className="fi-en-btn">
          {language === "en" ? "FI" : "EN"}
        </button>

        {isAdmin ? (
          <Link to="/profile" className="nav-icon">👤</Link>
        ) : (
          <>
            <Link to="/login" className="nav-icon">👤</Link>
            <Link to="/cart" className="nav-icon">🛒</Link>
          </>
        )}
      </div>
    </nav>
  );
}