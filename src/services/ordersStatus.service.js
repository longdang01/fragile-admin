import http from "../http-common";

const get = () => {
  return http.get(`/ordersStatuses`);
};

const search = (data) => {
  return http.post(`/ordersStatuses/search`, data);
};

const getById = (id) => {
  return http.get(`/ordersStatuses/${id}`);
};

const create = (data) => {
  return http.post(`/ordersStatuses`, data);
};

const update = (id, data) => {
  return http.put(`/ordersStatuses/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/ordersStatuses/${id}`);
};

const OrdersStatusService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default OrdersStatusService;
