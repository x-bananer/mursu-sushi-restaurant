import "./auth-shell.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";

import Login from "../../../components/customer/user/login/login.jsx";
import RegisterUser from "../../../components/customer/user/register-user/registerUser.jsx";
import RegisterAdmin from "../../../components/customer/user/register-adm/registerAdm.jsx";
import ForgotPassword from "../../../components/customer/user/forgot-password/forgotPassword.jsx";

import Modal from "../../../components/shared/modal/modal.jsx";

export default function Auth() {
	const { t } = useTranslation();
	const { user } = useAuth();
	const [mode, setMode] = useState("login");
	const [activeModal, setActiveModal] = useState(null); // "forgot" | "admin"

	if (user) {
		const targetPath = user?.role_id === 2 ? "/adm" : "/";
		return <Navigate to={targetPath} replace />;
	}

	return (
		<main className="layout page auth-wrapper">
			<div className="auth-card">
				<div className="auth-card__tabs">
					<div
						className={`auth-card__tab ${
							mode === "login"
								? "auth-card__tab--active"
								: "auth-card__tab--inactive"
						}`}
						onClick={() => setMode("login")}
					>
						{t("auth.sign_in")}
					</div>

					<div
						className={`auth-card__tab ${
							mode === "register"
								? "auth-card__tab--active"
								: "auth-card__tab--inactive"
						}`}
						onClick={() => setMode("register")}
					>
						{t("auth.register")}
					</div>
				</div>

				<div className="auth-card__body">
					{mode === "login" && (
						<Login
							onForgot={() => setActiveModal("forgot")}
							onAdminRegister={() => setActiveModal("admin")}
						/>
					)}

					{mode === "register" && <RegisterUser />}
				</div>
			</div>

			<Modal
				isOpen={activeModal === "forgot"}
				onClose={() => setActiveModal(null)}
				title={t("auth.reset_password")}
			>
				<ForgotPassword onClose={() => setActiveModal(null)} />
			</Modal>

			<Modal
				isOpen={activeModal === "admin"}
				onClose={() => setActiveModal(null)}
				title={t("auth.admin_sign")}
			>
				<RegisterAdmin onSuccess={() => setActiveModal(null)} />
			</Modal>
		</main>
	);
}
