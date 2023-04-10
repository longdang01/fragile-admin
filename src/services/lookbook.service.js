import http from "../http-common";

const get = () => {
  return http.get(`/lookbooks`);
};

const search = (data) => {
  return http.post(`/lookbooks/search`, data);
};

const getById = (id) => {
  return http.get(`/lookbooks/${id}`);
};

const create = (data) => {
  return http.post(`/lookbooks`, data);
};

const update = (id, data) => {
  return http.put(`/lookbooks/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/lookbooks/${id}`);
};

const LookbookService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default LookbookService;
