import axios from "axios";
import jwt_decode from "jwt-decode";
import UserService from "./services/user.service";

// export default axios.create({
//   baseURL: "http://localhost:5100/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

const jwtInterceptor = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

jwtInterceptor.interceptors.request.use(async (config) => {
  let ROLE = localStorage.getItem("ROLE");
  // let ADMIN_JWT_TOKEN = localStorage.getItem("ADMIN_JWT_TOKEN");
  // let IMPORT_JWT_TOKEN = localStorage.getItem("IMPORT_JWT_TOKEN");
  // let SALES_JWT_TOKEN = localStorage.getItem("SALES_JWT_TOKEN");
  // let MEDIA_JWT_TOKEN = localStorage.getItem("MEDIA_JWT_TOKEN");
  let TOKEN = localStorage.getItem("TOKEN");

  if (ROLE == 1) {
    // config.headers["Authorization"] = `Bearer ${ADMIN_JWT_TOKEN}`;
    config.headers["Role"] = 1;
  }

  if (ROLE == 2) {
    // config.headers["Authorization"] = `Bearer ${IMPORT_JWT_TOKEN}`;
    config.headers["Role"] = 2;
  }

  if (ROLE == 3) {
    // config.headers["Authorization"] = `Bearer ${SALES_JWT_TOKEN}`;
    config.headers["Role"] = 3;
  }

  if (ROLE == 4) {
    // config.headers["Authorization"] = `Bearer ${MEDIA_JWT_TOKEN}`;
    config.headers["Role"] = 4;
  }

  // const decoded = TOKEN && jwt_decode(TOKEN);
  // let accessToken = TOKEN;

  // if (decoded && decoded.exp < Date.now() / 1000) {
  //   const data = await UserService.refreshToken();
  //   accessToken = data.data.token;
  // }
  config.headers["Authorization"] = `Bearer ${TOKEN}`;

  return config;
});

// jwtInterceptor.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const config = error?.config;

//     if (error?.response?.status === 401 && !config?.sent) {
//       config.sent = true;

//       const data = await UserService.refreshToken();

//       if (data?.data.token) {
//         config.headers = {
//           ...config.headers,
//           authorization: `Bearer ${data?.data.token}`,
//         };
//       }

//       return axios(config);
//     }
//     return Promise.reject(error);
//   }
// );

export default jwtInterceptor;
