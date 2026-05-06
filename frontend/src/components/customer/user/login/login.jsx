import { useState } from "react";
import InputField from "../../../shared/input-field/InputField";
import Button from "../../../shared/button/Button";
import Loader from "../../../shared/loader/Loader";
import ErrorState from "../../../shared/error-state/errorState";
import { useLogin } from "../../../../hooks/apiHooks/auth";
import { useNavigate } from 'react-router';

export default function Login({ onForgot, onAdminRegister }) {
	const { login, loading, error } = useLogin();
  const navigate = useNavigate();

  console.log('login: ', login);

	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
		  const res = await login(form);

		  const role = res?.user?.role_id;

		  if (role === 2) {
			  navigate("/admin");
		  } else {
			  navigate("/user-profile");
		  }
	  } catch (err) {
		console.err(err);
	}
	};

	// LOADING STATE
	if (loading) {
		return <Loader text="Signing you in..." />;
	}

	return (
		<form onSubmit={handleSubmit}>
			{/* ERROR STATE */}
			{error && (
				<ErrorState
					message={error}
					onRetry={() => handleSubmit(new Event("submit"))}
				/>
			)}

			<InputField
				label="EMAIL ADDRESS"
				type="email"
				name="email"
				value={form.email}
				onChange={handleChange}
			/>

			<InputField
				label="PASSWORD"
				type="password"
				name="password"
				value={form.password}
				onChange={handleChange}
			/>

			<div className="auth-card__actions">
				<Button variant="light" className="auth-card__btn" type="submit">
					SIGN IN
				</Button>
			</div>

			<div className="auth-card__footer">
				{/* <button
					type="button"
					className="auth-card__link"
					onClick={onForgot}
				>
					FORGOT CREDENTIALS?
				</button> */}

				<button
					type="button"
					className="auth-card__link"
					onClick={onAdminRegister}
				>
					STAFF? Sign in HERE ↗
				</button>
			</div>
		</form>
	);
}
