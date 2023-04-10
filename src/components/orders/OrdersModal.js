import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { ordersModalValidator } from "../../common/Validation";
import { ordersDetailModalValidator } from "../../common/Validation";
import {
  configToast,
  configSelectStyle,
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";
import { getOptions } from "../../common/Functions";
import { toast } from "react-toastify";
import {
  ORDERS_STATUSES,
  ORDERS_PAYMENTS,
  ORDERS_PAIDS,
} from "../../common/Variable";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SunEditor from "suneditor-react";
import Select, { createFilter } from "react-select";
import Modal from "../../utils/modal/Modal";
import UploadService from "../../services/upload.service";
import ProductService from "../../services/product.service";
import ColorService from "../../services/color.service";
import SizeService from "../../services/size.service";

var slugify = require("slugify");

const OrdersModal = (props) => {
  const initData = {
    _id: "",
    customer: "",
    deliveryAddress: "",
    ordersCode: "",
    note: "",
    total: "",
    status: "",
    payment: "",
    paid: "",
  };

  const {
    ordersDetails,
    createOrders,
    updateOrders,
    getProduct,
    action,
    actionSub,
    show,
    deleteOrdersDetail,
    setIsLoading,
  } = props;
  const [orders, setOrders] = useState(initData);
  // const [note, setNote] = useState();
  // const [ordersDetails, setInvoiceDetails] = useState(initData);
  const [title, setTitle] = useState("");
  let [errors, setErrors] = useState([]);
  const [labelInputs, setLabelInputs] = useState([]);

  const [optionsProduct, setOptionsProduct] = useState([]);
  const [product, setProduct] = useState({});

  const handleInput = (e, label, type) => {
    // type: 1: orders, 2: ordersDetail
    // check input tag or select tag
    const { name, value } = e.target ? e.target : { name: label, value: e };

    const state = { [name]: value };

    setLabelInputs([name]);
    setOrders({ ...orders, ...state });
  };

  const handleSearch = async (data) => {
    const product = await getProduct(data);
    setProduct(product);
  };

  const handleImageRemove = async (isReset) => {
    if (isReset) {
      setOrders(initData);
      setProduct({});
    }
  };

  const handleCalcTotal = (ordersDetails) => {
    const total = ordersDetails.reduce((acc, item) => {
      return Number(item.quantity) * Number(item.price) + acc;
    }, 0);

    setOrders({
      ...orders,
      status: "",
      payment: "",
      paid: "",
      total: String(total),
    });
  };

  const onSave = async () => {
    const validate = ordersModalValidator(orders);

    if (validate.error) {
      const errors = getErrors(validate);
      setErrors(errors);
      setIsLoading(false);
    }

    if (!validate.error) {
      setIsLoading(true);
      if (ordersDetails.length == 0) {
        toast.error("Bạn chưa nhập sản phẩm nào", configToast);
        setIsLoading(false);

        return;
      }

      orders.details = ordersDetails;
      if (action == 0) createOrders(orders);
      if (action == 1) updateOrders(orders._id, orders);
    }
  };

  // catch error when change input
  useEffect(() => {
    const validate = ordersModalValidator(orders);
    setErrors(catchErrors(labelInputs, validate, errors));
  }, [orders]);

  useEffect(() => {
    // set options
    const optionsProduct = getOptions(props.products, "productName");
    setOptionsProduct(optionsProduct);

    handleImageRemove(true);
    setLabelInputs([]);
    setErrors([]);

    if (action == 1 && props.orders._id) {
      setOrders(props.orders);
      setTitle("Cập Nhật Đơn Bán");
    }

    if (action == 0 && !props.orders._id) {
      setOrders(initData);
      setTitle("Thêm Đơn Bán");

      // if (actionSub == undefined) {
      //   setNote("");
      //   setOrders({ ...orders, note: "" });
      // } else {
      //   setNote(note);
      //   setOrders({ ...orders, note: note });
      // }
    }
  }, [show, action, orders._id]);

  useEffect(() => {
    setIsLoading(false);

    // if (actionSub == -1) {
    //   setOrders({ ...orders, note: note });
    // }
  }, [actionSub]);

  useEffect(() => {
    if (action != 1) {
      handleCalcTotal(ordersDetails);
    }
  }, [ordersDetails.length, show]);

  return (
    <>
      <Modal
        onSave={onSave}
        title={title}
        onClose={props.onClose}
        show={props.show}
        isLoading={props.isLoading}
      >
        <div>
          {action == 0 && (
            <>
              <div className="g-col-12 form-group">
                <label className="form-label italic">
                  Chọn sản phẩm để bán (*)
                </label>
                <Select
                  styles={configSelectStyle}
                  name="productName"
                  className={
                    "form-control shadow-lg border-[2px] border-[#cccccc]"
                  }
                  onChange={(item) => handleSearch(item ? item.value : "")}
                  value={
                    product && optionsProduct
                      ? optionsProduct.find((item) => item.value == product._id)
                      : null
                  }
                  options={optionsProduct}
                  placeholder="Chọn sản phẩm"
                  filterOption={createFilter({
                    matchFrom: "any",
                    stringify: (option) => `${option.label}`,
                  })}
                  isSearchable={true}
                  isClearable={true}
                />
                {product._id && (
                  <button
                    className="button btn bg-slate-400 w-full mt-2"
                    title="Bán Hàng"
                    onClick={() =>
                      props.handleShowOverlap(product, 0, [0, 1], 1)
                    }
                  >
                    Bán Hàng
                  </button>
                )}
              </div>
              <hr className="my-5" />
            </>
          )}
          <div className="g-col-12 form-group">
            {ordersDetails && ordersDetails.length > 0 && (
              <div>
                <label className="form-label italic">
                  Danh sách sản phẩm chọn để bán (*)
                </label>
                <div>
                  <table className="table table-report -mt-2">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap capitalize text-center w-20">
                          STT
                        </th>
                        <th className="whitespace-nowrap capitalize ">
                          Tên Sản Phẩm
                        </th>

                        {action == 0 && (
                          <th className="text-center whitespace-nowrap capitalize w-56">
                            Tác Vụ
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {ordersDetails.map((ordersDetail, index) => (
                        <tr className="intro-x" key={index}>
                          <td className="w-20 text-center">
                            {/* {(page - 1) * pageSize + index + 1} */}
                            {index + 1}
                          </td>

                          <td>
                            <a
                              href={undefined}
                              className="font-medium whitespace-nowrap"
                            >
                              {ordersDetail.product?.productName}
                            </a>
                            <div
                              className="text-slate-500 text-xs whitespace-nowrap mt-0.5
                            flex items-center"
                            >
                              <span
                                className="color-group__item-sm"
                                style={{ background: ordersDetail.color?.hex }}
                              ></span>
                              {ordersDetail.color?.colorName}/
                              {ordersDetail.size?.sizeName}/x
                              {ordersDetail.quantity}/
                              {Number(ordersDetail.price).toLocaleString()} VND
                            </div>
                          </td>

                          {action == 0 && (
                            <td className="table-report__action w-56">
                              <div className="flex justify-center items-center">
                                <a
                                  className="flex items-center mr-3"
                                  href={undefined}
                                  onClick={() => {
                                    props.handleShowOverlap(
                                      ordersDetail,
                                      1,
                                      [0, 1],
                                      2
                                    );
                                  }}
                                >
                                  <i className="uil uil-edit"></i>
                                </a>
                                <a
                                  className="flex items-center text-danger"
                                  href={undefined}
                                  data-tw-toggle="modal"
                                  data-tw-target="#delete-confirmation-modal"
                                  onClick={() =>
                                    deleteOrdersDetail(ordersDetail)
                                  }
                                >
                                  <i className="uil uil-trash"></i>
                                </a>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <hr className="my-5" />
          <div className="g-col-12 form-group">
            <label className="form-label italic">Thông tin đơn bán (*)</label>
            <div>
              <div className="g-col-12 form-group">
                <label className="form-label italic">Khách Hàng (*)</label>
                <input
                  type="text"
                  name="staff"
                  className={"form-control shadow-lg "}
                  placeholder="Thể thao, Việc làm"
                  required
                  value={orders.customer || "Khách hàng mua trực tiếp"}
                  readOnly
                />
              </div>
              <div className="g-col-12 form-group">
                <label className="form-label italic">Chú thích</label>
                <SunEditor
                  autoFocus={false}
                  defaultValue={action == 0 ? "" : orders.note}
                  setContents={action == 0 ? "" : orders.note}
                  onChange={(data) => {
                    setOrders((orders) => {
                      return { ...orders, note: data };
                    });

                    // setNote(data);
                  }}
                  setOptions={configFullOptionSunEditor}
                />
              </div>
              <div className="g-col-12 form-group">
                <label className="form-label italic">Tổng tiền (*)</label>
                <input
                  type="text"
                  name="total"
                  className={"form-control shadow-lg "}
                  placeholder="Thể thao, Việc làm"
                  required
                  value={Number(orders.total).toLocaleString() + " VND"}
                  readOnly
                />
              </div>
              <div className="g-col-12 form-group">
                <label className="form-label italic">Trạng thái (*)</label>
                <Select
                  styles={configSelectStyle}
                  name="status"
                  className={
                    "form-control shadow-lg border-[2px] " +
                    (showError(errors, "status")
                      ? "border-[#FF0000] focusError"
                      : "border-[#cccccc]")
                  }
                  onChange={(item) =>
                    handleInput(item ? item.value : "", "status")
                  }
                  value={
                    orders.status
                      ? ORDERS_STATUSES.find(
                          (item) => item.value == orders.status
                        )
                      : null
                  }
                  options={ORDERS_STATUSES}
                  placeholder="Chọn trạng thái đơn bán"
                  filterOption={createFilter({
                    matchFrom: "any",
                    stringify: (option) => `${option.label}`,
                  })}
                  isSearchable={true}
                  isClearable={true}
                />
                <small className="text-red-600">
                  {showError(errors, "status") &&
                    showError(errors, "status").messages.map(
                      (message, index) => (
                        <div key={index}>&bull; {message}</div>
                      )
                    )}
                </small>
              </div>
              <div className="g-col-12 form-group">
                <label className="form-label italic">
                  Phương thức thanh toán (*)
                </label>
                <Select
                  styles={configSelectStyle}
                  name="payment"
                  className={
                    "form-control shadow-lg border-[2px] " +
                    (showError(errors, "payment")
                      ? "border-[#FF0000] focusError"
                      : "border-[#cccccc]")
                  }
                  onChange={(item) =>
                    handleInput(item ? item.value : "", "payment")
                  }
                  value={
                    orders.payment
                      ? ORDERS_PAYMENTS.find(
                          (item) => item.value == orders.payment
                        )
                      : null
                  }
                  options={ORDERS_PAYMENTS}
                  placeholder="Chọn phương thức thanh toán"
                  filterOption={createFilter({
                    matchFrom: "any",
                    stringify: (option) => `${option.label}`,
                  })}
                  isSearchable={true}
                  isClearable={true}
                />
                <small className="text-red-600">
                  {showError(errors, "payment") &&
                    showError(errors, "payment").messages.map(
                      (message, index) => (
                        <div key={index}>&bull; {message}</div>
                      )
                    )}
                </small>
              </div>
              <div className="g-col-12 form-group">
                <label className="form-label italic">
                  Đã thanh toán chưa? (*)
                </label>
                <Select
                  styles={configSelectStyle}
                  name="paid"
                  className={
                    "form-control shadow-lg border-[2px] " +
                    (showError(errors, "paid")
                      ? "border-[#FF0000] focusError"
                      : "border-[#cccccc]")
                  }
                  onChange={(item) =>
                    handleInput(item ? item.value : "", "paid")
                  }
                  value={
                    orders.paid
                      ? ORDERS_PAIDS.find((item) => item.value == orders.paid)
                      : null
                  }
                  options={ORDERS_PAIDS}
                  placeholder="Đã thanh toán chưa?"
                  filterOption={createFilter({
                    matchFrom: "any",
                    stringify: (option) => `${option.label}`,
                  })}
                  isSearchable={true}
                  isClearable={true}
                />
                <small className="text-red-600">
                  {showError(errors, "paid") &&
                    showError(errors, "paid").messages.map((message, index) => (
                      <div key={index}>&bull; {message}</div>
                    ))}
                </small>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OrdersModal;
