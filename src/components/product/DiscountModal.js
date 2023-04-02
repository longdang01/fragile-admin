import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { discountModalValidator } from "../../common/Validation";
import {
  configSelectStyle,
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";
import Select, { createFilter } from "react-select";
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SunEditor from "suneditor-react";
import Modal from "../../utils/modal/Modal";
import DiscountService from "../../services/discount.service";
import UploadService from "../../services/upload.service";

// Import Swiper React components
var slugify = require("slugify");

const DiscountModal = (props) => {
  const initData = {
    _id: "",
    color: props.color._id,
    discountName: "",
    value: "",
    symbol: "",
  };

  const {
    createDiscount,
    updateDiscount,
    deleteDiscount,
    action,
    show,
    setIsLoading,
    color,
  } = props;
  const [discount, setDiscount] = useState(initData);
  const [isChange, setIsChange] = useState(false);
  const [title, setTitle] = useState("");

  // validate
  let [errors, setErrors] = useState([]);
  const [labelInputs, setLabelInputs] = useState([]);

  const handleInput = (e, label) => {
    setIsChange(true);

    // check input tag or select tag
    const { name, value } = e.target ? e.target : { name: label, value: e };

    const state =
      name == "discountName"
        ? { [name]: value, path: slugify(value, configSlugify) }
        : { [name]: value };

    setLabelInputs(name == "discountName" ? [name, "path"] : [name]);

    setDiscount({ ...discount, ...state });
  };

  const handleImageRemove = (isReset) => {
    setIsChange(false);

    // remove input file value
    if (isReset) {
      // event refresh
      setErrors([]);
      setDiscount(initData);
    }
  };

  const getDiscount = async (id) => {
    const data = await DiscountService.getById(id);
    setDiscount(data.data);
  };

  const onSave = async () => {
    const validate = discountModalValidator(discount);

    if (validate.error) {
      const errors = getErrors(validate);
      setErrors(errors);
      setIsLoading(false);
    }

    if (!validate.error) {
      setIsLoading(true);

      if (!discount._id) createDiscount(discount);
      if (discount._id) {
        updateDiscount(discount._id, discount);
      }

      handleImageRemove(true);
    }
  };

  // catch after event remove
  useEffect(() => {
    if (!isChange) {
      handleImageRemove(true);
    }
  }, [isChange, props.isLoading]);

  // catch error when change input
  useEffect(() => {
    if (isChange) {
      const validate = discountModalValidator(discount);
      setErrors(catchErrors(labelInputs, validate, errors));
    }
  }, [discount]);

  useEffect(() => {
    setLabelInputs([]);
    setErrors([]);
    setTitle("Quản Lý Giảm Giá");
    handleImageRemove(true);
  }, [show, action, color._id]);

  return (
    <>
      <Modal
        onSave={onSave}
        title={title}
        onClose={props.onClose}
        show={props.show}
        disabledButtonSave={true}
        isLoading={props.isLoading}
      >
        <div className="height-[500px]">
          <div>
            <label className="form-label italic">Giảm Giá</label>

            <div className="flex justify-start items-center mt-[15px]">
              {props.color.discount ? (
                <button
                  className="color-group__item color-group__item-discount shadow"
                  onClick={(e) => getDiscount(props.color.discount._id)}
                >
                  {props.color.discount.discountName} (
                  {props.color.discount.value +
                    (props.color.discount.symbol == 1 ? "%" : "K")}
                  {" Giảm"})
                  {/* <i className="fa-regular fa-hand-pointer text-white opacity-0"></i> */}
                </button>
              ) : (
                <div>(Chưa có giảm giá)</div>
              )}
            </div>
          </div>
          <hr className="my-5" />

          <div className="g-col-12 form-group">
            <label className="form-label italic">Thông tin</label>

            <div>
              <div className="g-col-12 form-group">
                <label className="form-label italic">Tên discount (*)</label>
                <input
                  type="text"
                  name="discountName"
                  className={
                    "form-control shadow-lg " +
                    (showError(errors, "discountName")
                      ? "border-[#FF0000] focusError"
                      : "border-[#cccccc]")
                  }
                  placeholder="/the-thao, /viec-lam"
                  required
                  value={discount.discountName}
                  onChange={handleInput}
                />
                <small className="text-red-600">
                  {showError(errors, "discountName") &&
                    showError(errors, "discountName").messages.map(
                      (message, index) => (
                        <div key={index}>&bull; {message}</div>
                      )
                    )}
                </small>
              </div>
              <div className="g-col-12 form-group">
                <label className="form-label italic">Giá trị (*)</label>
                <input
                  type="text"
                  name="value"
                  className={
                    "form-control shadow-lg " +
                    (showError(errors, "value")
                      ? "border-[#FF0000] focusError"
                      : "border-[#cccccc]")
                  }
                  placeholder="/the-thao, /viec-lam"
                  required
                  value={discount.value}
                  onChange={handleInput}
                />
                <small className="text-red-600">
                  {showError(errors, "value") &&
                    showError(errors, "value").messages.map(
                      (message, index) => (
                        <div key={index}>&bull; {message}</div>
                      )
                    )}
                </small>
              </div>
              <div className="g-col-12 form-group">
                <label className="form-label italic">Đơn vị (*)</label>
                <Select
                  styles={configSelectStyle}
                  name="symbol"
                  className={
                    "form-control shadow-lg border-[2px] " +
                    (showError(errors, "symbol")
                      ? "border-[#FF0000] focusError"
                      : "border-[#cccccc]")
                  }
                  onChange={(item) => {
                    handleInput(item ? item.value : "", "symbol");
                  }}
                  value={
                    discount.symbol == 1
                      ? { label: "%", value: 1 }
                      : discount.symbol == 2
                      ? { label: "K", value: 2 }
                      : null
                  }
                  options={[
                    { label: "%", value: 1 },
                    { label: "K", value: 2 },
                  ]}
                  placeholder="Chọn đơn vị"
                  filterOption={createFilter({
                    matchFrom: "any",
                    stringify: (option) => `${option.label}`,
                  })}
                  isSearchable={true}
                  isClearable={true}
                />
                <small className="text-red-600">
                  {showError(errors, "symbol") &&
                    showError(errors, "symbol").messages.map(
                      (message, index) => (
                        <div key={index}>&bull; {message}</div>
                      )
                    )}
                </small>
              </div>
            </div>
            <div className="mt-[15px]">
              <button
                onClick={onSave}
                className={
                  props.isLoading
                    ? "button btn btn-primary button__loading loading"
                    : "button btn btn-primary button__loading"
                }
                disabled={props.isLoading}
                // title={discount._id === "" ? "Thêm" : "Cập Nhật"}
                title={"Cập Nhật"}
              >
                {/* {discount._id === "" ? (
                  <i className="uil uil-plus"></i>
                ) : ( */}
                <i className="uil uil-pen"></i>
                {/* )} */}
              </button>
              <button
                className={"button btn btn-danger ml-3 button__loading"}
                onClick={() => {
                  deleteDiscount(discount._id);
                }}
                disabled={discount._id === "" || props.isLoading ? true : false}
                title="Xóa"
              >
                <i className="uil uil-trash"></i>
              </button>
              <button
                className="button btn btn-secondary ml-3"
                disabled={false}
                onClick={(e) => handleImageRemove(true)}
                title="Làm Mới"
              >
                <i className="uil uil-refresh"></i>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DiscountModal;
