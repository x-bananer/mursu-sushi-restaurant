import { useState } from "react";
import { useNavigate } from "react-router";
import InputField from "../../../shared/input-field/InputField";
import Button from "../../../shared/button/Button";
import { fetchData } from "../../../../utils/fetchData";
import { useAuth } from "../../../../contexts/AuthContext";

export default function Login({ onForgot, onAdminRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    if (isSubmitting) {
      return;
    }

    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await fetchData("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      });

      if (data && data.token) {
        login(data.user, data.token);
        navigate("/user-profile", { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  let message = null;
  if (error) {
    message = <p className="auth-card__link">{error}</p>;
  }

  return (
    <>
      <InputField
        label="EMAIL ADDRESS"
        type="email"
        placeholder="ARCHITECT@MURSU.ZEN"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <InputField
        label="PASSWORD"
        type="password"
        placeholder="••••••••••"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <div className="auth-card__actions">
        <Button
          variant="light"
          className="auth-card__btn"
          type="button"
          onClick={handleLogin}
          disabled={isSubmitting}
        >
          SIGN IN
        </Button>

        <Button
          variant="link"
          className="auth-card__btn auth-card__btn--secondary"
        >
          CONTINUE AS GUEST
        </Button>
      </div>

      <div className="auth-card__footer">
        <button
          type="button"
          className="auth-card__link"
          onClick={onForgot}
        >
          FORGOT CREDENTIALS?
        </button>

        <button
          type="button"
          className="auth-card__link"
          onClick={onAdminRegister}
        >
          STAFF? REGISTER HERE ↗
        </button>
      </div>
      {message}
    </>
  );
}
