import { useLocation } from "react-router";
import BottomNavBase from "~/components/shared/nav/BottomNavBase";
import { MenuIcon, ComboIcon, HomeIcon, UserIcon, CartIcon } from "~/components/shared/nav/icons";

const items = [
  { to: "/menu",          icon: <MenuIcon /> },
  { to: "/combo-builder", icon: <ComboIcon /> },
  { to: "/",              icon: <HomeIcon /> },
  { to: "/login",         icon: <UserIcon /> },
  { to: "/cart",          icon: <CartIcon /> },
];

export default function CustomerBottomNav() {
  const location = useLocation();

  return (
    <BottomNavBase
      items={items.map(item => ({
        ...item,
        isActive: location.pathname === item.to,
      }))}
    />
  );
}