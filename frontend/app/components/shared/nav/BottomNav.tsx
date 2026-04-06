import { Link, useLocation } from "react-router";
import "./nav.css";

export default function BottomNav() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/adm");

  return (
    <nav className="bottom-nav">
      {!isAdmin && (
        <>
          <Link to="/menu" className="bottom-link">🍱</Link>
          <Link to="/combo-builder" className="bottom-link">🥢</Link>
        </>
      )}
      
      <Link to={isAdmin ? "/adm-panel" : "/"} className="logo">🏠</Link>

      {isAdmin ? 
        (
            <Link to="/adm-profile" className="nav-icon">👤</Link>
        ) : (
            <>
                <Link to="/login" className="nav-icon">👤</Link>
                <Link to="/cart" className="nav-icon">🛒</Link>
            </>
        )}
    </nav>
  );
}