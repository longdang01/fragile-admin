import http from "../http-common";

const login = (data) => {
  return http.post(`/users/login`, data);
};

const register = (data) => {
  return http.post(`/users/`, data);
};

const getMe = (id) => {
  return http.get(`/users/me`);
};

const UserService = {
  login,
  register,
  getMe,
};

export default UserService;
