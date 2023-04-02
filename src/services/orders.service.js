import http from "../http-common";

const get = () => {
  return http.get(`/orderses`);
};

const search = (data) => {
  return http.post(`/orderses/search`, data);
};

const getById = (id) => {
  return http.get(`/orderses/${id}`);
};

const create = (data) => {
  return http.post(`/orderses`, data);
};

const update = (id, data) => {
  return http.put(`/orderses/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/orderses/${id}`);
};

const OrdersService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default OrdersService;
