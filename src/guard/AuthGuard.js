import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import UserService from "../services/user.service";
import Login from "../components/user/Login";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TOAST_MESSAGE, PAGE_SIZE } from "../common/Variable";
import { configToast } from "../config/ConfigUI";

const AuthGuard = ({ children }) => {
  let navigate = useNavigate();
  const [staff, setStaff] = useState();
  const hasToken = localStorage.getItem("TOKEN");
  const hasStaff = localStorage.getItem("STAFF");
  const hasRole = localStorage.getItem("ROLE");

  useEffect(() => {
    async function getToken() {
      UserService.getMe()
        .then((res) => {
          setStaff(res);
        })
        .catch((err) => {
          setStaff(-1);
        });
      // const data = hasToken && (await UserService.getMe());
      // setStaff(data || -1);
    }
    if (hasToken) getToken();
  }, []);

  useEffect(() => {
    if (staff == -1 || !hasToken || !hasStaff || !hasRole) {
      navigate("/login");
    }
  }, [staff]);

  return staff && children;
};

export default AuthGuard;
