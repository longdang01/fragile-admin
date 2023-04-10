// export function useUserRoles() {
//   // some logic or api call to get the roles
//   // for demonstration purposes it's just hard coded
//   const userRoles = [1, 2, 3, 4];

//   // return the current user roles
//   return userRoles;
// }
import { Navigate } from "react-router-dom";

const RolesAuthRoute = ({ children, roles }) => {
  const userRoles = [1, 2, 3, 4];
  const role = Number(localStorage.getItem("ROLE"));

  const canAccess = roles.includes(role);
  //   const canAccess = userRoles.some((userRole) => roles.includes(role));

  if (canAccess) return <>{children}</>;

  return <Navigate to="/not-found" />;
};

export default RolesAuthRoute;
