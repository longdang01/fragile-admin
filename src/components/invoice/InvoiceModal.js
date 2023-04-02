import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { invoiceModalValidator } from "../../common/Validation";
import { invoiceDetailModalValidator } from "../../common/Validation";
import {
  configToast,
  configSelectStyle,
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";
import { getOptions } from "../../common/Functions";
import { toast } from "react-toastify";
import { INVOICE_PAIDS } from "../../common/Variable";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SunEditor from "suneditor-react";
import Select, { createFilter } from "react-select";
import Modal from "../../utils/modal/Modal";
import UploadService from "../../services/upload.service";
import ProductService from "../../services/product.service";
import ColorService from "../../services/color.service";
import SizeService from "../../services/size.service";

var slugify = require("slugify");

const InvoiceModal = (props) => {
  const ADMIN_INFO = JSON.parse(localStorage.getItem("ADMIN"));
  const STAFF_INFO = JSON.parse(localStorage.getItem("STAFF"));

  const initData = {
    _id: "",
    staff: ADMIN_INFO ? ADMIN_INFO._id : STAFF_INFO._id,
    invoiceCode: "",
    note: "",
    total: "",
    paid: "",
  };

  const {
    invoiceDetails,
    createInvoice,
    updateInvoice,
    getProduct,
    action,
    actionSub,
    show,
    deleteInvoiceDetail,
    setIsLoading,
  } = props;
  const [invoice, setInvoice] = useState(initData);
  const [staff, setStaff] = useState();
  // const [note, setNote] = useState();
  // const [invoiceDetails, setInvoiceDetails] = useState(initData);
  const [title, setTitle] = useState("");
  let [errors, setErrors] = useState([]);
  const [labelInputs, setLabelInputs] = useState([]);

  const [optionsProduct, setOptionsProduct] = useState([]);
  const [product, setProduct] = useState({});

  const handleInput = (e, label, type) => {
    // type: 1: invoice, 2: invoiceDetail
    // check input tag or select tag
    const { name, value } = e.target ? e.target : { name: label, value: e };

    const state = { [name]: value };

    setLabelInputs([name]);
    setInvoice({ ...invoice, ...state });
  };

  const handleSearch = async (data) => {
    const product = await getProduct(data);
    setProduct(product);
  };

  const handleImageRemove = async (isReset) => {
    if (isReset) {
      setInvoice(initData);
      setProduct({});
    }
  };

  const handleCalcTotal = (invoiceDetails) => {
    const total = invoiceDetails.reduce((acc, item) => {
      return Number(item.quantity) * Number(item.priceImport) + acc;
    }, 0);

    setInvoice({ ...invoice, paid: "", total: String(total) });
  };

  const onSave = async () => {
    const validate = invoiceModalValidator(invoice);

    if (validate.error) {
      const errors = getErrors(validate);
      setErrors(errors);
      setIsLoading(false);
    }

    if (!validate.error) {
      setIsLoading(true);
      if (invoiceDetails.length == 0) {
        toast.error("Bạn chưa nhập sản phẩm nào", configToast);
        setIsLoading(false);

        return;
      }

      invoice.details = invoiceDetails;
      if (action == 0) createInvoice(invoice);
      if (action == 1) updateInvoice(invoice._id, invoice);
    }
  };

  // catch error when change input
  useEffect(() => {
    const validate = invoiceModalValidator(invoice);
    setErrors(catchErrors(labelInputs, validate, errors));
  }, [invoice]);

  useEffect(() => {
    // set options
    const optionsProduct = getOptions(props.products, "productName");
    setOptionsProduct(optionsProduct);

    handleImageRemove(true);
    setLabelInputs([]);
    setErrors([]);
    setStaff(ADMIN_INFO ? ADMIN_INFO : STAFF_INFO);

    if (action == 1 && props.invoice._id) {
      setInvoice(props.invoice);
      setTitle("Cập Nhật Đơn Nhập");
    }

    if (action == 0 && !props.invoice._id) {
      setInvoice(initData);
      setTitle("Thêm Đơn Nhập");

      // if (actionSub == undefined) {
      //   setNote("");
      //   setInvoice({ ...invoice, note: "" });
      // } else {
      //   setNote(note);
      //   setInvoice({ ...invoice, note: note });
      // }
    }
  }, [show, action, invoice._id]);

  useEffect(() => {
    setIsLoading(false);

    if (actionSub == -1) {
      // setInvoice({ ...invoice, note: note });
    }
  }, [actionSub]);

  useEffect(() => {
    if (action != 1) {
      handleCalcTotal(invoiceDetails);
    }
  }, [invoiceDetails.length, show]);

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
                  Chọn sản phẩm để nhập (*)
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
                    title="Nhập Hàng"
                    onClick={() =>
                      props.handleShowOverlap(product, 0, [0, 1], 1)
                    }
                  >
                    Nhập Hàng
                  </button>
                )}
              </div>
              <hr className="my-5" />
            </>
          )}
          <div className="g-col-12 form-group">
            {invoiceDetails && invoiceDetails.length > 0 && (
              <div>
                <label className="form-label italic">
                  Danh sách sản phẩm chọn để nhập (*)
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
                      {invoiceDetails.map((invoiceDetail, index) => (
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
                              {invoiceDetail.product?.productName}
                            </a>
                            <div
                              className="text-slate-500 text-xs whitespace-nowrap mt-0.5
                            flex items-center"
                            >
                              <span
                                className="color-group__item-sm"
                                style={{ background: invoiceDetail.color?.hex }}
                              ></span>
                              {invoiceDetail.color?.colorName}/
                              {invoiceDetail.size?.sizeName}/x
                              {invoiceDetail.quantity}/
                              {Number(
                                invoiceDetail.priceImport
                              ).toLocaleString()}{" "}
                              VND
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
                                      invoiceDetail,
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
                                    deleteInvoiceDetail(invoiceDetail)
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
            <label className="form-label italic">Thông tin đơn nhập (*)</label>
            <div>
              <div className="g-col-12 form-group">
                <label className="form-label italic">
                  Nhân viên nhập hàng (*)
                </label>
                <input
                  type="text"
                  name="staff"
                  className={"form-control shadow-lg "}
                  placeholder="Thể thao, Việc làm"
                  required
                  value={staff?.staffName}
                  readOnly
                />
              </div>
              <div className="g-col-12 form-group">
                <label className="form-label italic">Chú thích</label>
                <SunEditor
                  autoFocus={false}
                  defaultValue={action == 0 ? "" : invoice.note}
                  setContents={action == 0 ? "" : invoice.note}
                  onChange={(data) => {
                    setInvoice((invoice) => {
                      return { ...invoice, note: data };
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
                  value={Number(invoice.total).toLocaleString() + " VND"}
                  readOnly
                />
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
                    invoice.paid
                      ? INVOICE_PAIDS.find((item) => item.value == invoice.paid)
                      : null
                  }
                  options={INVOICE_PAIDS}
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

export default InvoiceModal;
