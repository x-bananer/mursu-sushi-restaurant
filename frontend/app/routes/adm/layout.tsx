import { Outlet } from "react-router";
import AdminNavbar from "~/components/adm/nav/AdmNavbar";
import AdminBottomNav from "~/components/adm/nav/AdmBottomNav";
import AdminSideNav from "~/components/adm/nav/admSideNav";

export default function AdminLayout() {
  return (
    <>
      <header className="header">
        <AdminNavbar />
      </header>

      <main>
        <AdminSideNav />
        <Outlet />
      </main>

      <AdminBottomNav />
    </>
  );
}