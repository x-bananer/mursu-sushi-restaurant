import "./auth-shell.css";
import { useState } from "react";

import Login from "../../../components/customer/user/login/login.jsx";
import RegisterUser from "../../../components/customer/user/register-user/registerUser.jsx";
import RegisterAdmin from "../../../components/customer/user/register-adm/registerAdm.jsx";
import ForgotPassword from "../../../components/customer/user/forgot-password/forgotPassword.jsx";

import Modal from "../../../components/shared/modal/modal.jsx";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [activeModal, setActiveModal] = useState(null); // "forgot" | "admin"

  return (
    <main className="layout page auth-wrapper">
      <div className="auth-card">

        {/* ───── TABS ───── */}
        <div className="auth-card__tabs">
          <div
            className={`auth-card__tab ${
              mode === "login"
                ? "auth-card__tab--active"
                : "auth-card__tab--inactive"
            }`}
            onClick={() => setMode("login")}
          >
            SIGN IN
          </div>

          <div
            className={`auth-card__tab ${
              mode === "register"
                ? "auth-card__tab--active"
                : "auth-card__tab--inactive"
            }`}
            onClick={() => setMode("register")}
          >
            CREATE ACCOUNT
          </div>
        </div>

        {/* ───── BODY ───── */}
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

      {/* ───── MODALS ───── */}

      {/* FORGOT PASSWORD */}
      <Modal
        isOpen={activeModal === "forgot"}
        onClose={() => setActiveModal(null)}
        title="Reset Password"
      >
        <ForgotPassword onClose={() => setActiveModal(null)} />
      </Modal>

      {/* ADMIN REGISTER */}
      <Modal
        isOpen={activeModal === "admin"}
        onClose={() => setActiveModal(null)}
        title="Admin Sign"
      >
        <RegisterAdmin onSuccess={() => setActiveModal(null)} />
      </Modal>
    </main>
  );
}
