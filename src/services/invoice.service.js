import http from "../http-common";

const get = () => {
  return http.get(`/invoices`);
};

const search = (data) => {
  return http.post(`/invoices/search`, data);
};

const getById = (id) => {
  return http.get(`/invoices/${id}`);
};

const create = (data) => {
  return http.post(`/invoices`, data);
};

const update = (id, data) => {
  return http.put(`/invoices/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/invoices/${id}`);
};

const InvoiceService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default InvoiceService;
