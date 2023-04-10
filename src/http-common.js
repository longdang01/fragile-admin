import axios from "axios";

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

jwtInterceptor.interceptors.request.use((config) => {
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
  config.headers["Authorization"] = `Bearer ${TOKEN}`;

  // if (ROLE == 5) {
  //   config.headers["Authorization"] = `Bearer ${CUSTOMER_TOKEN}`;
  //   config.headers["Role"] = 5;
  // }

  return config;
});

export default jwtInterceptor;
