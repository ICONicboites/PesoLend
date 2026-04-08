import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/storage";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
