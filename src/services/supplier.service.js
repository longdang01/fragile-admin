import http from "../http-common";

const get = () => {
  return http.get(`/suppliers`);
};

const search = (data) => {
  return http.post(`/suppliers/search`, data);
};

const getById = (id) => {
  return http.get(`/suppliers/${id}`);
};

const create = (data) => {
  return http.post(`/suppliers`, data);
};

const update = (id, data) => {
  return http.put(`/suppliers/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/suppliers/${id}`);
};

const SupplierService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default SupplierService;
