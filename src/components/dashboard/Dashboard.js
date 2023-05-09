import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import faker from "faker";
import StaticsService from "../../services/statics.service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "Thống Kê Tổng Chi & Tổng Doanh Thu",
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Dashboard = () => {
  const [itemSales, setItemSales] = useState();
  const [itemOrders, setItemOrders] = useState();
  const [itemProducts, setItemProducts] = useState();
  const [itemCustomer, setItemCustomer] = useState();
  const [itemTotalSpending, setItemTotalSpending] = useState();
  const [itemRevenue, setItemRevenue] = useState();

  const getTotalProductSales = () => {
    StaticsService.getTotalProductSales()
      .then((res) => {
        setItemSales(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTotalProducts = () => {
    StaticsService.getTotalProducts()
      .then((res) => {
        setItemProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTotalCustomers = () => {
    StaticsService.getTotalCustomers()
      .then((res) => {
        setItemCustomer(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTotalOrders = () => {
    StaticsService.getTotalOrders()
      .then((res) => {
        setItemOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTotalSpending = () => {
    StaticsService.getTotalSpending()
      .then((res) => {
        setItemTotalSpending(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getRevenue = () => {
    StaticsService.getRevenue()
      .then((res) => {
        setItemRevenue(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTotalProductSales();
    getTotalProducts();
    getTotalCustomers();
    getTotalOrders();
    getTotalSpending();
    getRevenue();
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: "Tổng Chi",
        // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        data:
          itemTotalSpending &&
          itemTotalSpending
            .sort((a, b) => parseFloat(a.month) - parseFloat(b.month))
            .map((item) => item.result),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Tổng Doanh Thu",
        // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        data:
          itemRevenue &&
          itemRevenue
            .sort((a, b) => parseFloat(a.month) - parseFloat(b.month))
            .map((item) => item.result),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <>
      {/* <div className="mt-[32px]">
        <h2 className="text-lg font-medium truncate mr-5">
          Đang cập nhật chức năng ...
        </h2>
      </div> */}
      {/* style={{ display: "none" }} */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 2xl:col-span-9">
          <div className="grid grid-cols-12 gap-6">
            {/* <!-- BEGIN: General Report */}
            <div className="col-span-12 mt-8">
              <div className="intro-y flex items-center h-10">
                <h2 className="text-lg font-medium truncate mr-5">Thống Kê</h2>
                {/* <a href="" className="ml-auto flex items-center text-primary">
                  <i data-lucide="refresh-ccw" className="w-4 h-4 mr-3"></i>
                  Reload Data
                </a> */}
              </div>
              <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                  <div className="report-box zoom-in">
                    <div className="box p-5">
                      <div className="flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-shopping-cart report-box__icon text-theme-10"
                        >
                          <circle cx="9" cy="21" r="1"></circle>
                          <circle cx="20" cy="21" r="1"></circle>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {/* <div className="ml-auto">
                          <div
                            className="report-box__indicator bg-success tooltip cursor-pointer"
                            title="33% Higher than last month"
                          >
                            33%
                            <i
                              data-lucide="chevron-up"
                              className="w-4 h-4 ml-0.5"
                            ></i>
                          </div>
                        </div> */}
                      </div>
                      <div className="text-3xl font-medium leading-8 mt-6">
                        {itemSales}
                      </div>
                      <div className="text-base text-slate-500 mt-1">
                        Sản Phẩm Giảm Giá
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                  <div className="report-box zoom-in">
                    <div className="box p-5">
                      <div className="flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-credit-card report-box__icon text-theme-11"
                        >
                          <rect
                            x="1"
                            y="4"
                            width="22"
                            height="16"
                            rx="2"
                            ry="2"
                          ></rect>
                          <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                        {/* <div className="ml-auto">
                          <div
                            className="report-box__indicator bg-danger tooltip cursor-pointer"
                            title="2% Lower than last month"
                          >
                            2%
                            <i
                              data-lucide="chevron-down"
                              className="w-4 h-4 ml-0.5"
                            ></i>
                          </div>
                        </div> */}
                      </div>
                      <div className="text-3xl font-medium leading-8 mt-6">
                        {itemOrders}
                      </div>
                      <div className="text-base text-slate-500 mt-1">
                        Đơn Hàng
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                  <div className="report-box zoom-in">
                    <div className="box p-5">
                      <div className="flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-monitor report-box__icon text-theme-12"
                        >
                          <rect
                            x="2"
                            y="3"
                            width="20"
                            height="14"
                            rx="2"
                            ry="2"
                          ></rect>
                          <line x1="8" y1="21" x2="16" y2="21"></line>
                          <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                        {/* <div className="ml-auto">
                          <div
                            className="report-box__indicator bg-success tooltip cursor-pointer"
                            title="12% Higher than last month"
                          >
                            12%
                            <i
                              data-lucide="chevron-up"
                              className="w-4 h-4 ml-0.5"
                            ></i>
                          </div>
                        </div> */}
                      </div>
                      <div className="text-3xl font-medium leading-8 mt-6">
                        {itemProducts}
                      </div>
                      <div className="text-base text-slate-500 mt-1">
                        Sản Phẩm
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                  <div className="report-box zoom-in">
                    <div className="box p-5">
                      <div className="flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-user report-box__icon text-theme-9"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        {/* <div className="ml-auto">
                          <div
                            className="report-box__indicator bg-success tooltip cursor-pointer"
                            title="22% Higher than last month"
                          >
                            22%
                            <i
                              data-lucide="chevron-up"
                              className="w-4 h-4 ml-0.5"
                            ></i>
                          </div>
                        </div> */}
                      </div>
                      <div className="text-3xl font-medium leading-8 mt-6">
                        {itemCustomer}
                      </div>
                      <div className="text-base text-slate-500 mt-1">
                        Khách Hàng
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- END: General Report */}
          </div>
        </div>
      </div>
      <div style={{ marginTop: "50px" }}>
        <Bar options={options} data={data} />;
      </div>
    </>
  );
};

export default Dashboard;
