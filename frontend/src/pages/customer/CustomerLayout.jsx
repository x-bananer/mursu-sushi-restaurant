import { Outlet } from "react-router";
import Navbar from "../../components/customer/nav/Navbar";
import BottomNav from "../../components/customer/nav/BottomNav";

export default function CustomerLayout() {
  return (
    <>
      <header className="header">
        <Navbar />
      </header>

      <main className="layout page">
        <Outlet />
      </main>

      <BottomNav />
    </>
  );
}
