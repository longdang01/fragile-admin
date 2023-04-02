const menus = [
  {
    id: 1,
    name: "Bảng Điều Khiển",
    to: "/dashboard",
    icon: "uil uil-estate",
    subMenus: [],
  },
  {
    id: 2,
    name: "Nhập Hàng",
    to: null,
    icon: "uil uil-cube",
    subMenus: [
      {
        id: 1,
        name: "Sản Phẩm",
        to: "/product",
        icon: "uil uil-heart-rate",
      },
      {
        id: 2,
        name: "Đơn Nhập",
        to: "/invoice",
        icon: "uil uil-heart-rate",
      },
      {
        id: 3,
        name: "Danh Mục Cha",
        to: "/category",
        icon: "uil uil-heart-rate",
      },
      {
        id: 4,
        name: "Danh Mục Con",
        to: "/subCategory",
        icon: "uil uil-heart-rate",
      },
      {
        id: 5,
        name: "Thương Hiệu",
        to: "/brand",
        icon: "uil uil-heart-rate",
      },
      {
        id: 6,
        name: "Nhà Cung Cấp",
        to: "/supplier",
        icon: "uil uil-heart-rate",
      },
      {
        id: 7,
        name: "Bộ Sưu Tập",
        to: "/collection",
        icon: "uil uil-heart-rate",
      },
    ],
  },
  {
    id: 3,
    name: "Bán Hàng",
    to: null,
    icon: "uil uil-estate",
    subMenus: [
      {
        id: 1,
        name: "Đơn Bán",
        to: "/orders",
        icon: "uil uil-heart-rate",
      },
      {
        id: 2,
        name: "Khách Hàng",
        to: "/customer",
        icon: "uil uil-heart-rate",
      },
    ],
  },
  {
    id: 4,
    name: "Hệ Thống",
    to: null,
    icon: "uil uil-estate",
    subMenus: [
      {
        id: 1,
        name: "Nhân Viên",
        to: "/staff",
        icon: "uil uil-heart-rate",
      },
    ],
  },
  {
    id: 5,
    name: "Media",
    to: null,
    icon: "uil uil-estate",
    subMenus: [
      {
        id: 1,
        name: "Slide",
        to: "/slide",
        icon: "uil uil-heart-rate",
      },
    ],
  },
];

export { menus };
