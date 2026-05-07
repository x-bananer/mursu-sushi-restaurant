import { Outlet } from "react-router";
import React from "react";
import AdminNavbar from "../../components/adm/nav/AdmNavbar";
import AdminBottomNav from "../../components/adm/nav/AdmBottomNav";
import AdminSideNav from "../../components/adm/nav/admSideNav";

import "./adm-panel.css";

export default function AdminLayout() {
	const [collapsed, setCollapsed] = React.useState(false);

	return (
		<>
			<header className="header">
				<AdminNavbar />
			</header>

			<div
				className={`admin-shell ${collapsed ? "admin-shell--collapsed" : ""}`}
			>
				<AdminSideNav
					collapsed={collapsed}
					setCollapsed={setCollapsed}
				/>

				<main className="admin-main">
					<Outlet />
				</main>
			</div>

			<AdminBottomNav />
		</>
	);
}
