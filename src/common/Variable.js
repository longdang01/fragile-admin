const PAGE_SIZE = 5;

const TOAST_MESSAGE = {
  success: {
    create: "Thêm thành công",
    update: "Cập nhật thành công",
    delete: "Xóa thành công",
  },
  error: {
    create: "Thêm thất bại",
    update: "Cập nhật thất bại",
    delete: "Xóa thất bại",
  },
};

const ORDERS_STATUSES = [
  {
    label: "Đã giao & thành công",
    value: "1",
  },
  {
    label: "Chờ xác nhận",
    value: "2",
  },
  {
    label: "Đã xác nhận & đang chuẩn bị hàng",
    value: "3",
  },
  {
    label: "Đã chuẩn bị hàng & chờ lấy hàng",
    value: "4",
  },
  {
    label: "Hủy đơn hàng",
    value: "5",
  },
];

const ORDERS_PAYMENTS = [
  {
    label: "Thanh toán trực tiếp",
    value: "1",
  },
  {
    label: "Thanh toán khi nhận hàng",
    value: "2",
  },
  {
    label: "Chuyển khoản",
    value: "3",
  },
];

const ORDERS_PAIDS = [
  {
    label: "Đã thanh toán",
    value: "1",
  },
  {
    label: "Chưa thanh toán",
    value: "2",
  },
];

const INVOICE_PAIDS = [
  {
    label: "Đã thanh toán",
    value: "1",
  },
  {
    label: "Chưa thanh toán",
    value: "2",
  },
];

export {
  PAGE_SIZE,
  TOAST_MESSAGE,
  ORDERS_STATUSES,
  ORDERS_PAYMENTS,
  ORDERS_PAIDS,
  INVOICE_PAIDS,
};
