import http from "../http-common";

const get = () => {
  return http.get(`/customers`);
};

const search = (data) => {
  return http.post(`/customers/search`, data);
};

const getById = (id) => {
  return http.get(`/customers/${id}`);
};

const create = (data) => {
  return http.post(`/customers`, data);
};

const update = (id, data) => {
  return http.put(`/customers/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/customers/${id}`);
};

const CustomerService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default CustomerService;
