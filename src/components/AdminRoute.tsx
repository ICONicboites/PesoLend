import { getUser, isAdmin, setUser } from "../services/storage";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const user = getUser();
  const userIsAdmin = isAdmin();

  if (!user || !userIsAdmin) {
    // Allow direct /admin access without manual login.
    setUser({
      id: "admin-001",
      name: "Admin",
      email: "admin@pesolend.com",
    });
  }

  return <>{children}</>;
};
