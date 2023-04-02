import http from "../http-common";

const get = () => {
  return http.get(`/sizes`);
};

const search = (data) => {
  return http.post(`/sizes/search`, data);
};

const getById = (id) => {
  return http.get(`/sizes/${id}`);
};

const create = (data) => {
  return http.post(`/sizes`, data);
};

const update = (id, data) => {
  return http.put(`/sizes/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/sizes/${id}`);
};

const SizeService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default SizeService;
