import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const ADMIN = localStorage.getItem("ADMIN");
  const STAFF = localStorage.getItem("STAFF");
  if (ADMIN || STAFF) return children;
  return <Navigate to="/login"></Navigate>;
};

export default AuthGuard;
