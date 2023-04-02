import http from "../http-common";

const get = () => {
  return http.get(`/deliveryAddresses`);
};

const search = (data) => {
  return http.post(`/deliveryAddresses/search`, data);
};

const getById = (id) => {
  return http.get(`/deliveryAddresses/${id}`);
};

const create = (data) => {
  return http.post(`/deliveryAddresses`, data);
};

const update = (id, data) => {
  return http.put(`/deliveryAddresses/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/deliveryAddresses/${id}`);
};

const DeliveryAddressService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default DeliveryAddressService;
