import http from "../http-common";

const get = () => {
  return http.get(`/brands`);
};

const search = (data) => {
  return http.post(`/brands/search`, data);
};

const getById = (id) => {
  return http.get(`/brands/${id}`);
};

const create = (data) => {
  return http.post(`/brands`, data);
};

const update = (id, data) => {
  return http.put(`/brands/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/brands/${id}`);
};

const BrandService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default BrandService;
