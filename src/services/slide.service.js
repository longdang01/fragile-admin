import http from "../http-common";

const get = () => {
  return http.get(`/slides`);
};

const search = (data) => {
  return http.post(`/slides/search`, data);
};

const getById = (id) => {
  return http.get(`/slides/${id}`);
};

const create = (data) => {
  return http.post(`/slides`, data);
};

const update = (id, data) => {
  return http.put(`/slides/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/slides/${id}`);
};

const SlideService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default SlideService;
