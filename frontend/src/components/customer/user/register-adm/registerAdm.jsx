import InputField from "../../../shared/input-field/InputField";
import Button from "../../../shared/button/Button";

export default function RegisterAdmin({ onSuccess }) {
  return (
    <>
      <InputField label="ADMIN NAME" />

      <InputField
        label="EMAIL ADDRESS"
        type="email"
      />

      <InputField
        label="PASSWORD"
        type="password"
      />

      <div className="auth-card__actions">
        <Button
          variant="accent"
          onClick={onSuccess}
        >
          REGISTER
        </Button>
      </div>
    </>
  );
}
