import InputField from "../../../shared/input-field/InputField";
import Button from "../../../shared/button/Button";

export default function RegisterUser() {
  return (
    <>
      <div className="auth-card__row">
        <InputField label="FIRST NAME" placeholder="YUKIO" />
        <InputField label="LAST NAME" placeholder="MISHIMA" />
      </div>

      <InputField
        label="EMAIL ADDRESS"
        type="email"
      />

      <InputField
        label="PASSWORD"
        type="password"
      />

      <div className="auth-card__actions">
        <Button variant="light" className="auth-card__btn">
          CREATE ACCOUNT
        </Button>
      </div>
    </>
  );
}
