import http from "../http-common";

const get = () => {
  return http.get(`/staffs`);
};

const search = (data) => {
  return http.post(`/staffs/search`, data);
};

const getById = (id) => {
  return http.get(`/staffs/${id}`);
};

const create = (data) => {
  return http.post(`/staffs`, data);
};

const update = (id, data) => {
  return http.put(`/staffs/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/staffs/${id}`);
};

const StaffService = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};

export default StaffService;
