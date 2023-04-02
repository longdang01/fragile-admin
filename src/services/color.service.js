import http from "../http-common";

const get = () => {
  return http.get(`/colors`);
};

const search = (data) => {
  return http.post(`/colors/search`, data);
};

const getById = (id) => {
  return http.get(`/colors/${id}`);
};

const create = (data) => {
  return http.post(`/colors`, data);
};

const update = (id, data) => {
  return http.put(`/colors/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/colors/${id}`);
};

const ColorService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default ColorService;
