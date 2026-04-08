// LoansPage - redirects to dashboard with apply flow
// This is a placeholder as loan applications are handled from dashboard
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoansPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard - loan applications are managed from there
    navigate("/dashboard");
  }, [navigate]);

  return null;
};

export default LoansPage;
