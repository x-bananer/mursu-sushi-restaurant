import "./login.css";

export default function Login() {
	return (
		<div className="auth-wrapper">
			<div className="auth-card">
				<div className="auth-card__tabs">
					<div className="auth-card__tab auth-card__tab--inactive">
						SIGN IN
					</div>
					<div className="auth-card__tab auth-card__tab--active">
						CREATE ACCOUNT
					</div>
				</div>

				<form className="auth-card__body" id="form-register">
					<div className="auth-card__row">
						<label className="input-field">
							<span className="input-field__label">
								FIRST NAME
							</span>
							<input
								className="input-field__input"
								type="text"
								placeholder="YUKIO"
							/>
						</label>

						<label className="input-field">
							<span className="input-field__label">
								LAST NAME
							</span>
							<input
								className="input-field__input"
								type="text"
								placeholder="MISHIMA"
							/>
						</label>
					</div>

					<label className="input-field">
						<span className="input-field__label">
							EMAIL ADDRESS
						</span>
						<input
							className="input-field__input"
							type="email"
							placeholder="ARCHITECT@MURSU.ZEN"
						/>
					</label>

					<label className="input-field">
						<span className="input-field__label">PASSWORD</span>
						<input
							className="input-field__input"
							type="password"
							placeholder="••••••••••"
						/>
					</label>

					<div className="auth-card__actions">
						<button
							className="btn btn--light auth-card__btn"
							type="button"
						>
							CREATE ACCOUNT
						</button>
						<button
							className="btn btn--link auth-card__btn auth-card__btn--secondary"
							type="button"
						>
							CONTINUE AS GUEST
						</button>
					</div>

					<div className="auth-card__footer">
						<a href="#" className="auth-card__link">
							FORGOT CREDENTIALS?
						</a>
						<a href="#" className="auth-card__link">
							STAFF? ADMIN PANEL IS AT /ADMIN ↗
						</a>
					</div>
				</form>
			</div>
		</div>
	);
}
