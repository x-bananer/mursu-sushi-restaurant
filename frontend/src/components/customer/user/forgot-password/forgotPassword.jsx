import InputField from "../../../shared/input-field/InputField";
import Button from "../../../shared/button/Button";

export default function ForgotPassword({ onClose }) {
  return (
    <>
      <InputField
        label="EMAIL ADDRESS"
        type="email"
      />

      <InputField
        label="NEW PASSWORD"
        type="password"
      />

      <div className="auth-card__actions">
        <Button variant="accent">
          UPDATE PASSWORD
        </Button>

        <Button variant="link" onClick={onClose}>
          CANCEL
        </Button>
      </div>
    </>
  );
}
