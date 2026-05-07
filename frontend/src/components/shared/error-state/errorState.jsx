import "./error-state.css";

export default function ErrorState({
	message = "Something went wrong",
	onRetry,
	isLight = false,
}) {
	return (
		<div className={`error-state ${isLight ? "error-state--light" : ""}`}>
			<p className="error-state__message">{message}</p>

			{onRetry && (
				<button className="error-state__retry" onClick={onRetry}>
					Retry
				</button>
			)}
		</div>
	);
}
