import http from "../http-common";

const get = () => {
  return http.get(`/invoiceDetails`);
};

const search = (data) => {
  return http.post(`/invoiceDetails/search`, data);
};

const getById = (id) => {
  return http.get(`/invoiceDetails/${id}`);
};

const create = (data) => {
  return http.post(`/invoiceDetails`, data);
};

const update = (id, data) => {
  return http.put(`/invoiceDetails/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/invoiceDetails/${id}`);
};

const InvoiceDetailService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default InvoiceDetailService;
