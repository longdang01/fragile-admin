import http from "../http-common";

const get = () => {
  return http.get(`/discounts`);
};

const search = (data) => {
  return http.post(`/discounts/search`, data);
};

const getById = (id) => {
  return http.get(`/discounts/${id}`);
};

const create = (data) => {
  return http.post(`/discounts`, data);
};

const update = (id, data) => {
  return http.put(`/discounts/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/discounts/${id}`);
};

const DiscountService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default DiscountService;
