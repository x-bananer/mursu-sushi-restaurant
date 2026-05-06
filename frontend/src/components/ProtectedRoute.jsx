import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/shared/loader/Loader";

/**
 * Higher-order component to protect routes based on authentication and roles.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
	const { user, isLoading, isAdmin } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return (
			<div className="layout page center-content">
				<Loader size={48} text="Verifying session..." />
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/auth" state={{ from: location }} replace />;
	}

	if (adminOnly && !isAdmin) {
		return <Navigate to="/" replace />;
	}

	return children;
}
