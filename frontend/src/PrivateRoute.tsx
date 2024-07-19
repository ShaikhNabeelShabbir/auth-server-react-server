import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = ({ loggedIn }: { loggedIn: boolean }) => {
  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;