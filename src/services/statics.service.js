import http from "../http-common";

const getTotalSpending = () => {
  return http.get(`statics/get-total-spending`);
};

const getRevenue = () => {
  return http.get(`statics/get-revenue`);
};

// getTotalProductSales
const getTotalProductSales = () => {
  return http.get(`statics/get-total-product-sales`);
};

// getTotalProducts
const getTotalProducts = () => {
  return http.get(`statics/get-total-products`);
};

// getTotalCustomers
const getTotalCustomers = () => {
  return http.get(`statics/get-total-customers`);
};

// getTotalOrders
const getTotalOrders = () => {
  return http.get(`statics/get-total-orders`);
};

const StaticsService = {
  getTotalProductSales,
  getTotalProducts,
  getTotalCustomers,
  getTotalOrders,
  getTotalSpending,
  getRevenue,
};

export default StaticsService;
