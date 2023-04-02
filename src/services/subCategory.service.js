import http from "../http-common";

const get = () => {
  return http.get(`/subCategories`);
};

const search = (data) => {
  return http.post(`/subCategories/search`, data);
};

const getById = (id) => {
  return http.get(`/subCategories/${id}`);
};

const create = (data) => {
  return http.post(`/subCategories`, data);
};

const update = (id, data) => {
  return http.put(`/subCategories/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/subCategories/${id}`);
};

const SubCategoryService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default SubCategoryService;
