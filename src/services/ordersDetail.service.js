import http from "../http-common";

const get = () => {
  return http.get(`/ordersDetails`);
};

const search = (data) => {
  return http.post(`/ordersDetails/search`, data);
};

const getById = (id) => {
  return http.get(`/ordersDetails/${id}`);
};

const create = (data) => {
  return http.post(`/ordersDetails`, data);
};

const update = (id, data) => {
  return http.put(`/ordersDetails/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/ordersDetails/${id}`);
};

const OrdersDetailService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default OrdersDetailService;
