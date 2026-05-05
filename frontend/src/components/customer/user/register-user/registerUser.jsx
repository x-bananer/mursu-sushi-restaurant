import { useState } from "react";
import InputField from "../../../shared/input-field/InputField";
import Button from "../../../shared/button/Button";
import { fetchData } from "../../../../utils/fetchData";
import { saveAuth } from "../../../../utils/authStorage";
import { useNavigate } from "react-router";

export default function RegisterUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleRegister() {
    if (isSubmitting) {
      return;
    }

    setError("");
    setNotice("");

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirst) {
      setError("First name is required.");
      return;
    }

    if (!trimmedEmail || !password) {
      setError("Email and password are required.");
      return;
    }

    let fullName = trimmedFirst;
    if (trimmedLast) {
      fullName = `${trimmedFirst} ${trimmedLast}`;
    }

    setIsSubmitting(true);

    try {
      const data = await fetchData("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: trimmedEmail,
          password,
        }),
      });

      if (data && data.token) {
        saveAuth({ token: data.token, user: data.user });
        setNotice("Account created.");
      }
      navigate("/user-profile", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  let message = null;
  if (error) {
    message = <p className="auth-card__link">{error}</p>;
  } else if (notice) {
    message = <p className="auth-card__link">{notice}</p>;
  }

  return (
    <>
      <div className="auth-card__row">
        <InputField
          label="FIRST NAME"
          placeholder="YUKIO"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <InputField
          label="LAST NAME"
          placeholder="MISHIMA"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
      </div>

      <InputField
        label="EMAIL ADDRESS"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <InputField
        label="PASSWORD"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <div className="auth-card__actions">
        <Button
          variant="light"
          className="auth-card__btn"
          type="button"
          onClick={handleRegister}
          disabled={isSubmitting}
        >
          CREATE ACCOUNT
        </Button>
      </div>
      {message}
    </>
  );
}
