import http from "../http-common";

const login = (data) => {
  return http.post(`/users/login`, data);
};

const register = (data) => {
  return http.post(`/users/register`, data);
};

const getMe = () => {
  return http.get(`/users/me`);
};

const UserService = {
  login,
  register,
  getMe,
};

export default UserService;
