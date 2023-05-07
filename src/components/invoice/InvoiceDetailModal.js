import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { invoiceDetailModalValidator } from "../../common/Validation";
import {
  configToast,
  configSelectStyle,
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";
import { toast } from "react-toastify";
import { getOptions } from "../../common/Functions";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SunEditor from "suneditor-react";
import Select, { createFilter } from "react-select";
import Modal from "../../utils/modal/Modal";
import UploadService from "../../services/upload.service";
import ProductService from "../../services/product.service";
import ColorService from "../../services/color.service";
import SizeService from "../../services/size.service";
var slugify = require("slugify");

const InvoiceDetailModal = (props) => {
  const initData = {
    _id: "",
    invoice: "",
    product: props.product?._id || "",
    color: "",
    size: "",
    priceImport: "",
    quantity: "",
  };

  const {
    saveInvoiceDetail,
    action,
    actionSub,
    show,
    setIsLoading,
    setActionSub,
  } = props;
  const [invoiceDetail, setInvoiceDetail] = useState(initData);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [color, setColor] = useState();
  // const [hex, setHex] = useState();
  // const [sizes, setSizes] = useState([]);
  const [title, setTitle] = useState("");

  // validate
  let [errors, setErrors] = useState([]);
  const [labelInputs, setLabelInputs] = useState([]);

  // const [product, setProduct] = useState({});
  // const [color, setColor] = useState({});
  // const [size, setSize] = useState({});
  const [optionsColor, setOptionsColor] = useState([]);
  const [optionsSize, setOptionsSize] = useState([]);

  const handleInput = (e, label, type) => {
    // type: 1: invoice, 2: invoiceDetail
    // check input tag or select tag
    const { name, value } = e.target ? e.target : { name: label, value: e };

    const state = { [name]: value };

    setLabelInputs([name]);
    setInvoiceDetail({ ...invoiceDetail, ...state });
  };

  const handleImageRemove = async (isReset) => {
    if (isReset) {
      setInvoiceDetail(initData);
    }
  };

  const handleSearch = async (data, obj) => {
    // 1: color, 2: size

    if (obj == 1) {
      const color = data ? await getColor(data) : "";
      // setColor(color);
      setInvoiceDetail({ ...invoiceDetail, color: color, size: "" });
      setLabelInputs(["color"]);
      setColor(color);
      // setHex(color.hex);
      // setSizes(color.sizes);
    }

    if (obj == 2) {
      const size = data ? await getSize(data) : "";
      // setSize(size);
      setInvoiceDetail({ ...invoiceDetail, size: size });
      setLabelInputs(["size"]);
    }
  };

  const getProduct = async (id) => {
    const data = await ProductService.getById(id);
    return data.data;
  };

  const getColor = async (id) => {
    const data = await ColorService.getById(id);
    return data.data;
  };

  const getSize = async (id) => {
    const data = await SizeService.getById(id);
    return data.data;
  };

  const onSave = async () => {
    const validate = invoiceDetailModalValidator(invoiceDetail);
    if (validate.error) {
      const errors = getErrors(validate);
      setErrors(errors);
      setIsLoading(false);
    }

    if (!validate.error) {
      setIsLoading(true);
      const condProd =
        invoiceDetail.product && invoiceDetail.product._id
          ? invoiceDetail.product._id
          : invoiceDetail.product;
      const condColor =
        invoiceDetail.color && invoiceDetail.color._id
          ? invoiceDetail.color._id
          : invoiceDetail.color;
      const condSize =
        invoiceDetail.size && invoiceDetail.size._id
          ? invoiceDetail.size._id
          : invoiceDetail.size;
      const product = await getProduct(condProd);
      const color = await getColor(condColor);
      const size = await getSize(condSize);
      invoiceDetail.product = product;
      invoiceDetail.color = color;
      invoiceDetail.size = size;

      const check =
        invoiceDetails.length > 0 &&
        invoiceDetails.find(
          (item) =>
            (((item.product &&
              item.product._id === invoiceDetail.product._id) ||
              item.product === invoiceDetail.product._id) &&
              ((item.color && item.color._id === invoiceDetail.color._id) ||
                item.color === invoiceDetail.color._id) &&
              item.size &&
              item.size._id === invoiceDetail.size._id) ||
            item.size === invoiceDetail.size._id
        );

      // console.log("sub", actionSub);
      // console.log("check", actionSub);
      if (actionSub == 0) {
        if (check) {
          toast.error("Phân loại hàng đã có trong giỏ nhập", configToast);
          setIsLoading(false);
        }

        if (!check) {
          invoiceDetails.unshift(invoiceDetail);
          // setInvoiceDetails([invoiceDetail, ...invoiceDetails]);
          setInvoiceDetails(invoiceDetails);
        }
      }

      if (actionSub == 1) {
        // if (check) {
        //   toast.error("Phân loại hàng đã có trong giỏ nhập", configToast);
        //   setIsLoading(false);
        // }

        // if (!check) {
        const index =
          invoiceDetails.length > 0 &&
          invoiceDetails.findIndex(
            (item) =>
              (((item.product &&
                item.product._id === invoiceDetail.product._id) ||
                item.product === invoiceDetail.product._id) &&
                ((item.color && item.color._id === invoiceDetail.color._id) ||
                  item.color === invoiceDetail.color._id) &&
                item.size &&
                item.size._id === invoiceDetail.size._id) ||
              item.size === invoiceDetail.size._id
          );
        let ivd = { ...invoiceDetail };
        ivd = {
          ...ivd,
          product: product,
          color: color,
          size: size,
        };

        console.log("ivd", ivd);

        invoiceDetails[index] = ivd;
        setInvoiceDetails(invoiceDetails);
        // }
      }

      saveInvoiceDetail(invoiceDetails);
    }
  };

  const onClose = async () => {
    // setIsLoading(true);
    if (actionSub == 0) {
      props.onClose();
      setActionSub(-1);
      return;
    }

    const condProd =
      props.invoiceDetail.product && props.invoiceDetail.product._id
        ? props.invoiceDetail.product._id
        : props.invoiceDetail.product;
    const condColor =
      props.invoiceDetail.color && props.invoiceDetail.color._id
        ? props.invoiceDetail.color._id
        : props.invoiceDetail.color;
    const condSize =
      props.invoiceDetail.size && props.invoiceDetail.size._id
        ? props.invoiceDetail.size._id
        : props.invoiceDetail.size;
    const product = await getProduct(condProd);
    const color = await getColor(condColor);
    const size = await getSize(condSize);
    let ivd = { ...props.invoiceDetail };
    ivd = {
      ...ivd,
      product: product,
      color: color,
      size: size,
    };

    if (invoiceDetails.length > 0) {
      const index = invoiceDetails.findIndex(
        (item) =>
          (((item.product &&
            item.product._id === props.invoiceDetail.product._id) ||
            item.product === props.invoiceDetail.product._id) &&
            ((item.color && item.color._id === props.invoiceDetail.color._id) ||
              item.color === props.invoiceDetail.color._id) &&
            item.size &&
            item.size._id === props.invoiceDetail.size._id) ||
          item.size === props.invoiceDetail.size._id
      );

      invoiceDetails[index] = ivd;
    }
    setInvoiceDetails(invoiceDetails);
    saveInvoiceDetail(invoiceDetails);
  };

  // catch error when change input
  useEffect(() => {
    // if (actionSub != -1) {
    const validate = invoiceDetailModalValidator(invoiceDetail);
    setErrors(catchErrors(labelInputs, validate, errors));
    // }
  }, [invoiceDetail]);

  useEffect(() => {
    const optionsSize = getOptions(color?.sizes, "sizeName");
    setOptionsSize(optionsSize);

    if (!invoiceDetail.color) {
      // setLabelInputs(["color", "size"]);
      // setSizes([]);
      // setHex();
      setColor();
      setInvoiceDetail({ ...invoiceDetail, size: "" });
    }
  }, [invoiceDetail.color]);

  // useEffect(() => {
  //   if (props.invoiceDetail.product._id) setInvoiceDetail(props.invoiceDetail);
  // }, [props.invoiceDetail]);

  useEffect(() => {
    // handleImageRemove(true);
    const optionsColor = getOptions(props.product.colors, "colorName");
    setOptionsColor(optionsColor);
    // setSizes([]);
    setColor();
    setTitle("Nhập Hàng");
    setErrors([]);
    setLabelInputs([]);

    if (props.invoiceDetails.length == 0) setInvoiceDetails([]);
    if (props.invoiceDetails.length != 0)
      setInvoiceDetails(props.invoiceDetails);

    if (actionSub == 0) {
      setInvoiceDetail(initData);
    }

    if (actionSub == 1) {
      setInvoiceDetail(props.invoiceDetail);
      setColor(props.invoiceDetail.color);
      // setHex(props.invoiceDetail.color.hex);
      // setSizes(props.invoiceDetail.color.sizes);
    }
    // if (
    //   actionSub == 1 &&
    //   (props.invoiceDetail.color?._id || props.invoiceDetail.color)
    // ) {
    //   setInvoiceDetail(props.invoiceDetail);
    // } else {
    // setInvoiceDetail(initData);
    // }
  }, [show, action]);

  return (
    <>
      <Modal
        onSave={onSave}
        title={title}
        actionSub={actionSub}
        onClose={onClose}
        // onClose={() => {
        //   props.onClose();
        //   setActionSub(-1);
        // }}
        // onClose={
        //   () => {
        //     console.log("1", invoiceDetails);
        //     saveInvoiceDetail(invoiceDetails);
        //   }
        //   // props.onClose
        // }
        show={props.show}
        isLoading={props.isLoading}
      >
        <div>
          {invoiceDetail.product && (
            <div>
              <div className="g-col-12 form-group">
                <label className="form-label italic">Thông tin</label>
                <input
                  type="text"
                  name="productName"
                  className="form-control border-[#cccccc] shadow-lg mb-[8px]"
                  required
                  value={props.product.productName}
                  readOnly
                />
                <small></small>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="g-col-12 form-group">
                  <label className="form-label italic">Màu sắc (*)</label>
                  <div className="flex items-center justify-between">
                    <div style={{ width: "242px" }}>
                      <Select
                        styles={configSelectStyle}
                        name="color"
                        className={
                          "form-control shadow-lg border-[2px] " +
                          (showError(errors, "color")
                            ? "border-[#FF0000] focusError"
                            : "border-[#cccccc]")
                        }
                        onChange={(item) =>
                          handleSearch(item ? item.value : "", 1)
                        }
                        value={
                          invoiceDetail.color && optionsColor
                            ? optionsColor.find(
                                (item) =>
                                  item.value == invoiceDetail.color ||
                                  item.value == invoiceDetail.color._id
                              )
                            : null
                        }
                        options={optionsColor}
                        placeholder="Chọn màu sắc"
                        filterOption={createFilter({
                          matchFrom: "any",
                          stringify: (option) => `${option.label}`,
                        })}
                        isSearchable={true}
                        isClearable={true}
                        isDisabled={actionSub == 1 ? true : false}
                      />
                    </div>
                    <div
                      className="color-group__item ml-2"
                      style={{
                        background: color?.hex ? color?.hex : "transparent",
                      }}
                    ></div>
                  </div>
                  <small className="text-red-600">
                    {showError(errors, "color") &&
                      showError(errors, "color").messages.map(
                        (message, index) => (
                          <div key={index}>&bull; {message}</div>
                        )
                      )}
                  </small>
                </div>
                <div className="g-col-12 form-group">
                  <label className="form-label italic">Kích cỡ (*)</label>
                  <Select
                    styles={configSelectStyle}
                    name="size"
                    className={
                      "form-control shadow-lg border-[2px] " +
                      (showError(errors, "size")
                        ? "border-[#FF0000] focusError"
                        : "border-[#cccccc]")
                    }
                    onChange={(item) => handleSearch(item ? item.value : "", 2)}
                    value={
                      invoiceDetail.size && optionsSize
                        ? optionsSize.find(
                            (item) =>
                              item.value == invoiceDetail.size ||
                              item.value == invoiceDetail.size._id
                          )
                        : null
                    }
                    options={optionsSize}
                    placeholder="Chọn kích cỡ"
                    filterOption={createFilter({
                      matchFrom: "any",
                      stringify: (option) => `${option.label}`,
                    })}
                    isSearchable={true}
                    isClearable={true}
                    // isSearchable={actionSub == 0 ? true : false}
                    // isClearable={actionSub == 0 ? true : false}
                    isDisabled={actionSub == 1 ? true : false}
                  />
                  <small className="text-red-600">
                    {showError(errors, "size") &&
                      showError(errors, "size").messages.map(
                        (message, index) => (
                          <div key={index}>&bull; {message}</div>
                        )
                      )}
                  </small>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="g-col-12 form-group">
                  <label className="form-label italic">Số Lượng (*)</label>
                  <input
                    type="text"
                    name="quantity"
                    className={
                      "form-control shadow-lg " +
                      (showError(errors, "quantity")
                        ? "border-[#FF0000] focusError"
                        : "border-[#cccccc]")
                    }
                    placeholder="/the-thao, /viec-lam"
                    required
                    value={invoiceDetail.quantity}
                    onChange={(e) => handleInput(e, "", 2)}
                  />
                  <small className="text-red-600">
                    {showError(errors, "quantity") &&
                      showError(errors, "quantity").messages.map(
                        (message, index) => (
                          <div key={index}>&bull; {message}</div>
                        )
                      )}
                  </small>
                </div>
                <div className="g-col-12 form-group">
                  <label className="form-label italic">Giá Nhập (*)</label>
                  <input
                    type="text"
                    name="priceImport"
                    className={
                      "form-control shadow-lg " +
                      (showError(errors, "priceImport")
                        ? "border-[#FF0000] focusError"
                        : "border-[#cccccc]")
                    }
                    placeholder="/the-thao, /viec-lam"
                    required
                    value={invoiceDetail.priceImport}
                    onChange={(e) => handleInput(e, "", 2)}
                  />
                  <small className="text-red-600">
                    {showError(errors, "priceImport") &&
                      showError(errors, "priceImport").messages.map(
                        (message, index) => (
                          <div key={index}>&bull; {message}</div>
                        )
                      )}
                  </small>
                </div>
              </div>
            </div>
          )}
          {/*
          <div className="g-col-12 form-group">
            <label className="form-label italic">Mô tả</label>
            <SunEditor
              autoFocus={false}
              defaultValue={action == 0 ? "" : invoice.description}
              setContents={action == 0 ? "" : invoice.description}
              onChange={(data) => {
                setInvoice((invoice) => {
                  return { ...invoice, description: data };
                });
              }}
              setOptions={configFullOptionSunEditor}
            />
          </div> */}
        </div>
      </Modal>
    </>
  );
};

export default InvoiceDetailModal;
