import http from "../http-common";

const get = () => {
  return http.get(`/collections`);
};

const search = (data) => {
  return http.post(`/collections/search`, data);
};

const getById = (id) => {
  return http.get(`/collections/${id}`);
};

const create = (data) => {
  return http.post(`/collections`, data);
};

const update = (id, data) => {
  return http.put(`/collections/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/collections/${id}`);
};

const CollectionService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default CollectionService;
