import http from "../http-common";

const get = () => {
  return http.get(`/collectionImages`);
};

const search = (data) => {
  return http.post(`/collectionImages/search`, data);
};

const getById = (id) => {
  return http.get(`/collectionImages/${id}`);
};

const create = (data) => {
  return http.post(`/collectionImages`, data);
};

const update = (id, data) => {
  return http.put(`/collectionImages/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/collectionImages/${id}`);
};

const CollectionImageService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default CollectionImageService;
