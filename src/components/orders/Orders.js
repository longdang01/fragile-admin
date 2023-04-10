import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { TOAST_MESSAGE, PAGE_SIZE } from "../../common/Variable";
import { configToast } from "../../config/ConfigUI";
import { Helmet, HelmetProvider } from "react-helmet-async";
import OrdersTable from "./OrdersTable";
import OrdersModal from "./OrdersModal";
import OrdersDetailModal from "./OrdersDetailModal";
import OrdersService from "../../services/orders.service";
import ProductService from "../../services/product.service";
import ConfirmDialog from "../shared/ConfirmDialog";

const TITLE = "Quản Lý Đơn Bán";
const TITLE_NAME = "Đơn Bán";

const Orders = () => {
  const [orderses, setOrderses] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState({});
  const [ordersDetail, setOrdersDetail] = useState({});
  const [ordersDetails, setOrdersDetails] = useState([]);
  const [show, setShow] = useState(false);
  const [showType, setShowType] = useState([0]);
  const [product, setProduct] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemDelete, setItemDelete] = useState();
  const [action, setAction] = useState(0);
  const [actionSub, setActionSub] = useState();
  const [searchData, setSearchData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const [page, setPage] = useState(1);
  // const [pageSize, setPageSize] = useState(PAGE_SIZE);
  // const [count, setCount] = useState(0);

  const handleSearch = (e) => {
    setSearchData(e);
  };

  const handleShow = async (action, show, id, type = [0]) => {
    const data = id ? await getOrders(id) : {};
    if (action == 0) setOrdersDetails([]);
    if (action == 1) setOrdersDetails(data.ordersDetails);
    setOrders(data);
    setAction(action);
    setShow(show);
    setShowType(type);
  };

  const handleShowOverlap = async (product, action, type, obj) => {
    // obj: 1: prod, 2: ivd
    if (obj == 1) setProduct(product);
    if (obj == 2) setOrdersDetail(product);
    setShowType(type);
    setActionSub(action);
  };

  const getOrderses = () => {
    OrdersService.search({
      searchData: searchData,
      // page: page,
      // pageSize: pageSize,
    })
      .then((res) => {
        // console.log(res.data);
        setOrderses(res.data.orderses);
        setProducts(res.data.products);
        // setOrderses(res.data.orderses);
        // setCount(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getOrders = async (id) => {
    const data = await OrdersService.getById(id);
    return data.data;
  };

  const createOrders = (orders) => {
    setIsLoading(false);

    OrdersService.create(orders)
      .then((res) => {
        setOrderses([res.data, ...orderses]);
        setIsLoading(false);
        setShow(false);
        toast.success(TOAST_MESSAGE.success.create, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
  };

  const updateOrders = (id, orders) => {
    OrdersService.update(id, orders)
      .then((res) => {
        setOrderses(
          orderses.map((item) => (item._id == res.data._id ? res.data : item))
        );
        setIsLoading(false);
        setShow(false);
        toast.success(TOAST_MESSAGE.success.update, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
  };

  const deleteOrders = (id) => {
    // let confirm = window.confirm("Bạn có chắc chắn xóa không?");
    // if (confirm) {
    if (!showConfirm) {
      setItemDelete(id);
      setShowConfirm(true);
      return;
    }

    setIsLoading(true);
    OrdersService.remove(itemDelete)
      .then((res) => {
        setOrderses(orderses.filter((orders) => orders._id !== itemDelete));
        // setCount(count - 1);
        setIsLoading(false);
        setShowConfirm(false);

        toast.success(TOAST_MESSAGE.success.delete, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
    // }
  };

  const getProduct = async (id) => {
    const data = await ProductService.getById(id);
    return data.data;
  };

  const saveOrdersDetail = (ordersDetails) => {
    setOrdersDetails(ordersDetails);
    setShowType([0]);
    setActionSub(-1);
  };

  const deleteOrdersDetail = (ordersDetail) => {
    if (!showConfirm) {
      const index = ordersDetails.findIndex(
        (item) =>
          item.product._id == ordersDetail.product._id &&
          item.color._id == ordersDetail.color._id &&
          item.size._id == ordersDetail.size._id
      );

      setItemDelete(index);
      setShowConfirm(true);
      return;
    }

    ordersDetails.splice(itemDelete, 1);

    setOrdersDetails(ordersDetails);
    setShowType([0]);
    setShowConfirm(false);
  };

  useEffect(() => {
    getOrderses();
  }, [
    searchData,
    // , page, pageSize, count
  ]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <meta charset="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <title>{TITLE + " / Fragile - Blog, News and Magazine"}</title>
        </Helmet>
      </HelmetProvider>

      <OrdersModal
        show={showType.includes(0) && show}
        onClose={() => {
          setShow(false);
          setActionSub(undefined);
        }}
        action={action}
        actionSub={actionSub}
        products={products}
        handleShowOverlap={handleShowOverlap}
        orders={orders}
        ordersDetails={ordersDetails}
        getProduct={getProduct}
        createOrders={createOrders}
        updateOrders={updateOrders}
        deleteOrdersDetail={deleteOrdersDetail}
        isLoading={isLoading}
        setIsLoading={(state) => setIsLoading(state)}
      />

      <OrdersDetailModal
        show={showType.includes(1) && show}
        onClose={() => {
          setShowType([0]);
          // setOrdersDetail({});
          setActionSub(-1);
        }}
        action={action}
        actionSub={actionSub}
        product={product}
        ordersDetail={ordersDetail}
        ordersDetails={ordersDetails}
        saveOrdersDetail={saveOrdersDetail}
        isLoading={isLoading}
        setActionSub={(state) => setActionSub(state)}
        setIsLoading={(state) => setIsLoading(state)}
      />

      <ConfirmDialog
        onSave={
          showType.includes(0) || !showType
            ? show
              ? deleteOrdersDetail
              : deleteOrders
            : null
        }
        showConfirm={showConfirm}
        title={"Xác nhận xóa?"}
        onClose={() => setShowConfirm(false)}
        isLoading={isLoading}
        setIsLoading={(state) => setIsLoading(state)}
      />

      <h2 className="intro-y text-lg font-medium mt-10">
        <span className="capitalize">{TITLE}</span>
      </h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <button
            className="btn btn-primary shadow-md mr-2"
            onClick={() => handleShow(0, true, "")}
          >
            <span className="capitalize">Thêm {TITLE_NAME}</span>
          </button>

          <div className="hidden md:block mx-auto text-slate-500">
            {/* Hiển thị {orderses.length} / {count} danh mục cha */}
            Hiển thị {PAGE_SIZE} / {orderses.length}{" "}
            <span className="lowercase">{TITLE_NAME}</span>
          </div>
          <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div className="w-56 relative text-slate-500">
              <input
                type="text"
                className="form-control w-56 box pr-10"
                placeholder="Tìm kiếm..."
                value={searchData}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <i className="uil uil-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"></i>
              {/* <i class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"></i> */}
            </div>
          </div>
        </div>
        {/* <!-- BEGIN: Data List --> */}
        <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
          <OrdersTable
            orderses={orderses}
            deleteOrders={deleteOrders}
            handleShow={handleShow}
            // onSetPage={(page) => setPage(page)}
            // page={page}
            // pageSize={pageSize}
            // count={count}
          />
        </div>
      </div>
    </>
  );
};

export default Orders;
