import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { ordersDetailModalValidator } from "../../common/Validation";
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

const OrdersDetailModal = (props) => {
  const initData = {
    _id: "",
    orders: "",
    product: props.product?._id || "",
    color: "",
    size: "",
    price: "",
    quantity: "",
  };

  const {
    saveOrdersDetail,
    action,
    actionSub,
    show,
    setIsLoading,
    setActionSub,
  } = props;
  const [ordersDetail, setOrdersDetail] = useState(initData);
  const [ordersDetails, setOrdersDetails] = useState([]);
  const [hex, setHex] = useState();
  const [sizes, setSizes] = useState([]);
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
    // type: 1: invoice, 2: ordersDetail
    // check input tag or select tag
    const { name, value } = e.target ? e.target : { name: label, value: e };

    const state = { [name]: value };

    setLabelInputs([name]);
    setOrdersDetail({ ...ordersDetail, ...state });
  };

  const handleImageRemove = async (isReset) => {
    if (isReset) {
      setOrdersDetail(initData);
    }
  };

  const handleSearch = async (data, obj) => {
    // 1: color, 2: size

    if (obj == 1) {
      const color = data ? await getColor(data) : "";
      // setColor(color);
      setOrdersDetail({
        ...ordersDetail,
        color: color,
        size: "",
        price: color.price,
      });
      setLabelInputs(["color"]);
      setHex(color.hex);
      setSizes(color.sizes);
    }

    if (obj == 2) {
      const size = data ? await getSize(data) : "";
      // setSize(size);
      setOrdersDetail({ ...ordersDetail, size: size });
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
    const validate = ordersDetailModalValidator(ordersDetail);
    if (validate.error) {
      const errors = getErrors(validate);
      setErrors(errors);
      setIsLoading(false);
    }

    if (!validate.error) {
      setIsLoading(true);
      const condProd =
        ordersDetail.product && ordersDetail.product._id
          ? ordersDetail.product._id
          : ordersDetail.product;
      const condColor =
        ordersDetail.color && ordersDetail.color._id
          ? ordersDetail.color._id
          : ordersDetail.color;
      const condSize =
        ordersDetail.size && ordersDetail.size._id
          ? ordersDetail.size._id
          : ordersDetail.size;
      const product = await getProduct(condProd);
      const color = await getColor(condColor);
      const size = await getSize(condSize);
      ordersDetail.product = product;
      ordersDetail.color = color;
      ordersDetail.size = size;

      const check =
        ordersDetails.length > 0 &&
        ordersDetails.find(
          (item) =>
            (((item.product && item.product._id === ordersDetail.product._id) ||
              item.product === ordersDetail.product._id) &&
              ((item.color && item.color._id === ordersDetail.color._id) ||
                item.color === ordersDetail.color._id) &&
              item.size &&
              item.size._id === ordersDetail.size._id) ||
            item.size === ordersDetail.size._id
        );

      if (actionSub == 0) {
        if (check) {
          toast.error("Phân loại hàng đã có trong giỏ hàng", configToast);
          setIsLoading(false);
        }

        if (!check) {
          ordersDetails.unshift(ordersDetail);
          // setOrdersDetails([ordersDetail, ...ordersDetails]);
          setOrdersDetails(ordersDetails);
        }
      }

      if (actionSub == 1) {
        const index =
          ordersDetails.length > 0 &&
          ordersDetails.findIndex(
            (item) =>
              (((item.product &&
                item.product._id === ordersDetail.product._id) ||
                item.product === ordersDetail.product._id) &&
                ((item.color && item.color._id === ordersDetail.color._id) ||
                  item.color === ordersDetail.color._id) &&
                item.size &&
                item.size._id === ordersDetail.size._id) ||
              item.size === ordersDetail.size._id
          );
        let ivd = { ...ordersDetail };
        ivd = {
          ...ivd,
          product: product,
          color: color,
          size: size,
        };

        ordersDetails[index] = ivd;
        setOrdersDetails(ordersDetails);
      }

      saveOrdersDetail(ordersDetails);
    }
  };

  const onClose = async () => {
    // setIsLoading(true);

    const condProd =
      props.ordersDetail.product && props.ordersDetail.product._id
        ? props.ordersDetail.product._id
        : props.ordersDetail.product;
    const condColor =
      props.ordersDetail.color && props.ordersDetail.color._id
        ? props.ordersDetail.color._id
        : props.ordersDetail.color;
    const condSize =
      props.ordersDetail.size && props.ordersDetail.size._id
        ? props.ordersDetail.size._id
        : props.ordersDetail.size;
    const product = await getProduct(condProd);
    const color = await getColor(condColor);
    const size = await getSize(condSize);
    let ivd = { ...props.ordersDetail };
    ivd = {
      ...ivd,
      product: product,
      color: color,
      size: size,
    };

    if (ordersDetails.length > 0) {
      const index = ordersDetails.findIndex(
        (item) =>
          (((item.product &&
            item.product._id === props.ordersDetail.product._id) ||
            item.product === props.ordersDetail.product._id) &&
            ((item.color && item.color._id === props.ordersDetail.color._id) ||
              item.color === props.ordersDetail.color._id) &&
            item.size &&
            item.size._id === props.ordersDetail.size._id) ||
          item.size === props.ordersDetail.size._id
      );
      ordersDetails[index] = ivd;
    }
    setOrdersDetails(ordersDetails);
    saveOrdersDetail(ordersDetails);
  };

  // catch error when change input
  useEffect(() => {
    // if (actionSub != -1) {
    const validate = ordersDetailModalValidator(ordersDetail);
    setErrors(catchErrors(labelInputs, validate, errors));
    // }
  }, [ordersDetail]);

  useEffect(() => {
    const optionsSize = getOptions(sizes, "sizeName");
    setOptionsSize(optionsSize);

    if (!ordersDetail.color) {
      // setLabelInputs(["color", "size"]);
      setSizes([]);
      setHex();
      setOrdersDetail({ ...ordersDetail, size: "" });
    }
  }, [ordersDetail.color]);

  // useEffect(() => {
  //   if (props.ordersDetail.product._id) setOrdersDetail(props.ordersDetail);
  // }, [props.ordersDetail]);

  useEffect(() => {
    // handleImageRemove(true);
    const optionsColor = getOptions(props.product.colors, "colorName");
    setOptionsColor(optionsColor);
    setSizes([]);
    setTitle("Bán Hàng");
    setErrors([]);
    setLabelInputs([]);

    if (props.ordersDetails.length == 0) setOrdersDetails([]);
    if (props.ordersDetails.length != 0) setOrdersDetails(props.ordersDetails);

    if (actionSub == 0) {
      setOrdersDetail(initData);
    }

    if (actionSub == 1) {
      setOrdersDetail(props.ordersDetail);
      setHex(props.ordersDetail.color.hex);
      setSizes(props.ordersDetail.color.sizes);
    }
    // if (
    //   actionSub == 1 &&
    //   (props.ordersDetail.color?._id || props.ordersDetail.color)
    // ) {
    //   setOrdersDetail(props.ordersDetail);
    // } else {
    // setOrdersDetail(initData);
    // }
  }, [show, action]);

  return (
    <>
      <Modal
        onSave={onSave}
        title={title}
        actionSub={actionSub}
        // onClose={onClose}
        onClose={() => {
          props.onClose();
          setActionSub(-1);
        }}
        // onClose={
        //   () => {
        //     console.log("1", ordersDetails);
        //     saveOrdersDetail(ordersDetails);
        //   }
        //   // props.onClose
        // }
        show={props.show}
        isLoading={props.isLoading}
      >
        <div>
          {ordersDetail.product && (
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
                          ordersDetail.color && optionsColor
                            ? optionsColor.find(
                                (item) =>
                                  item.value == ordersDetail.color ||
                                  item.value == ordersDetail.color._id
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
                      />
                    </div>
                    <div
                      className="color-group__item ml-2"
                      style={{
                        background: hex ? hex : "transparent",
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
                      ordersDetail.size && optionsSize
                        ? optionsSize.find(
                            (item) =>
                              item.value == ordersDetail.size ||
                              item.value == ordersDetail.size._id
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
                    value={ordersDetail.quantity}
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
                  <label className="form-label italic">Giá Bán (*)</label>
                  <input
                    type="text"
                    name="price"
                    className={
                      "form-control shadow-lg " +
                      (showError(errors, "price")
                        ? "border-[#FF0000] focusError"
                        : "border-[#cccccc]")
                    }
                    placeholder="/the-thao, /viec-lam"
                    required
                    value={ordersDetail.price}
                    onChange={(e) => handleInput(e, "", 2)}
                    readOnly
                  />
                  <small className="text-red-600">
                    {showError(errors, "price") &&
                      showError(errors, "price").messages.map(
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

export default OrdersDetailModal;
