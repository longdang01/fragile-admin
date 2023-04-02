import http from "../http-common";

const get = () => {
  return http.get(`/colorImages`);
};

const search = (data) => {
  return http.post(`/colorImages/search`, data);
};

const getById = (id) => {
  return http.get(`/colorImages/${id}`);
};

const create = (data) => {
  return http.post(`/colorImages`, data);
};

const update = (id, data) => {
  return http.put(`/colorImages/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/colorImages/${id}`);
};

const ColorImageService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default ColorImageService;
