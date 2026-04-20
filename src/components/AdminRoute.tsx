import { Navigate } from "react-router-dom";
import { getUser, isAdmin } from "../services/storage";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const user = getUser();
  const userIsAdmin = isAdmin();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!userIsAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
