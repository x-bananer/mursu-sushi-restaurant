import InputField from "../../../shared/input-field/InputField";
import Button from "../../../shared/button/Button";

export default function Login({ onForgot, onAdminRegister }) {
  return (
    <>
      <InputField
        label="EMAIL ADDRESS"
        type="email"
        placeholder="ARCHITECT@MURSU.ZEN"
      />

      <InputField
        label="PASSWORD"
        type="password"
        placeholder="••••••••••"
      />

      <div className="auth-card__actions">
        <Button variant="light" className="auth-card__btn">
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
    </>
  );
}
