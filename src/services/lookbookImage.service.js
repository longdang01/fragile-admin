import http from "../http-common";

const get = () => {
  return http.get(`/lookbookImages`);
};

const search = (data) => {
  return http.post(`/lookbookImages/search`, data);
};

const getById = (id) => {
  return http.get(`/lookbookImages/${id}`);
};

const create = (data) => {
  return http.post(`/lookbookImages`, data);
};

const update = (id, data) => {
  return http.put(`/lookbookImages/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/lookbookImages/${id}`);
};

const LookbookImageService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default LookbookImageService;
