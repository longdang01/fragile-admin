import http from "../http-common";

const get = () => {
  return http.get(`/categories`);
};

const search = (data) => {
  return http.post(`/categories/search`, data);
};

const getById = (id) => {
  return http.get(`/categories/${id}`);
};

const create = (data) => {
  return http.post(`/categories`, data);
};

const update = (id, data) => {
  return http.put(`/categories/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/categories/${id}`);
};

const CategoryService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default CategoryService;
