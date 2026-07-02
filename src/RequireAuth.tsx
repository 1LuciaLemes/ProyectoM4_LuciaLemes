import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./features/auth/Authenticator";
import type { JSX, ReactNode } from "react";

function RequireAuth({ children }: { children: ReactNode }): JSX.Element {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="full-page-loading">
                <p>Cargando sesión...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

export default RequireAuth;