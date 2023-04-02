import http from "../http-common";

const upload = (file) => {
  let formData = new FormData();

  formData.append("image", file);

  return http.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default {
  upload,
};
