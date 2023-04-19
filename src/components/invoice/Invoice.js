import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { TOAST_MESSAGE, PAGE_SIZE } from "../../common/Variable";
import { configToast } from "../../config/ConfigUI";
import { Helmet, HelmetProvider } from "react-helmet-async";
import InvoiceTable from "./InvoiceTable";
import InvoiceModal from "./InvoiceModal";
import InvoiceDetailModal from "./InvoiceDetailModal";
import InvoiceService from "../../services/invoice.service";
import ProductService from "../../services/product.service";
import ColorService from "../../services/color.service";
import SizeService from "../../services/size.service";
import ConfirmDialog from "../shared/ConfirmDialog";

const TITLE = "Quản Lý Đơn Nhập";
const TITLE_NAME = "Đơn Nhập";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoice, setInvoice] = useState({});
  const [invoiceDetail, setInvoiceDetail] = useState({});
  const [invoiceDetails, setInvoiceDetails] = useState([]);
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
    const data = id ? await getInvoice(id) : {};
    if (action == 0) setInvoiceDetails([]);
    if (action == 1) setInvoiceDetails(data.invoiceDetails);
    setInvoice(data);
    setAction(action);
    setShow(show);
    setShowType(type);
  };

  const handleShowOverlap = async (product, action, type, obj) => {
    // obj: 1: prod, 2: ivd
    if (obj == 1) setProduct(product);
    if (obj == 2) setInvoiceDetail(product);
    setShowType(type);
    setActionSub(action);
  };

  const getInvoices = () => {
    InvoiceService.search({
      searchData: searchData,
      // page: page,
      // pageSize: pageSize,
    })
      .then((res) => {
        // console.log(res.data);
        setInvoices(res.data.invoices);
        setProducts(res.data.products);
        // setInvoices(res.data.invoices);
        // setCount(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getInvoice = async (id) => {
    const data = await InvoiceService.getById(id);
    return data.data;
  };

  const createInvoice = (invoice) => {
    setIsLoading(false);

    InvoiceService.create(invoice)
      .then((res) => {
        setInvoices([res.data, ...invoices]);
        setIsLoading(false);
        setShow(false);
        toast.success(TOAST_MESSAGE.success.create, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
  };

  const updateInvoice = (id, invoice) => {
    InvoiceService.update(id, invoice)
      .then((res) => {
        setInvoices(
          invoices.map((item) => (item._id == res.data._id ? res.data : item))
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

  const deleteInvoice = (id) => {
    // let confirm = window.confirm("Bạn có chắc chắn xóa không?");
    // if (confirm) {
    if (!showConfirm) {
      setItemDelete(id);
      setShowConfirm(true);
      return;
    }

    setIsLoading(true);
    InvoiceService.remove(itemDelete)
      .then((res) => {
        setInvoices(invoices.filter((invoice) => invoice._id !== itemDelete));
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

  const saveInvoiceDetail = (invoiceDetails) => {
    setInvoiceDetails(invoiceDetails);
    setShowType([0]);
    setActionSub(-1);
  };

  const deleteInvoiceDetail = (invoiceDetail) => {
    if (!showConfirm) {
      const index = invoiceDetails.findIndex(
        (item) =>
          item.product._id == invoiceDetail.product._id &&
          item.color._id == invoiceDetail.color._id &&
          item.size._id == invoiceDetail.size._id
      );

      setItemDelete(index);
      setShowConfirm(true);
      return;
    }

    invoiceDetails.splice(itemDelete, 1);

    setInvoiceDetails(invoiceDetails);
    setShowType([0]);
    setShowConfirm(false);
  };

  useEffect(() => {
    getInvoices();
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
          <title>
            {TITLE + " / Fragile - Thương Hiệu Thời Trang Việt Nam"}
          </title>
        </Helmet>
      </HelmetProvider>

      <InvoiceModal
        show={showType.includes(0) && show}
        onClose={() => {
          setShow(false);
          setActionSub(undefined);
        }}
        action={action}
        actionSub={actionSub}
        products={products}
        handleShowOverlap={handleShowOverlap}
        invoice={invoice}
        invoiceDetails={invoiceDetails}
        getProduct={getProduct}
        createInvoice={createInvoice}
        updateInvoice={updateInvoice}
        deleteInvoiceDetail={deleteInvoiceDetail}
        isLoading={isLoading}
        setIsLoading={(state) => setIsLoading(state)}
      />

      <InvoiceDetailModal
        show={showType.includes(1) && show}
        onClose={() => {
          setShowType([0]);
          // setInvoiceDetail({});
          setActionSub(-1);
        }}
        action={action}
        actionSub={actionSub}
        product={product}
        invoiceDetail={invoiceDetail}
        invoiceDetails={invoiceDetails}
        saveInvoiceDetail={saveInvoiceDetail}
        isLoading={isLoading}
        setActionSub={(state) => setActionSub(state)}
        setIsLoading={(state) => setIsLoading(state)}
      />

      <ConfirmDialog
        onSave={
          showType.includes(0) || !showType
            ? show
              ? deleteInvoiceDetail
              : deleteInvoice
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
            {/* Hiển thị {invoices.length} / {count} danh mục cha */}
            Hiển thị {PAGE_SIZE} / {invoices.length}{" "}
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
          <InvoiceTable
            invoices={invoices}
            deleteInvoice={deleteInvoice}
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

export default Invoice;
