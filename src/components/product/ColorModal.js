import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import {
  colorImageModalValidator,
  colorModalValidator,
} from "../../common/Validation";
import {
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SunEditor from "suneditor-react";
import Modal from "../../utils/modal/Modal";
import ColorService from "../../services/color.service";
import UploadService from "../../services/upload.service";

//color
import { SketchPicker } from "react-color";
import {
  getColorName,
  getTextColor,
  getIconColor,
  presetColors,
  buildDownload,
} from "../../common/Color";
const LOCAL_STORAGE_ID = "react-color-name-g859u";
// const initialColor = window.localStorage.getItem(LOCAL_STORAGE_ID) || "#ff6f61";

// Import Swiper React components
var slugify = require("slugify");

const ColorModal = (props) => {
  const initData = {
    _id: "",
    product: props.product._id,
    colorName: "",
    // hex: window.localStorage.getItem(LOCAL_STORAGE_ID) || "#ff6f61",
    // hex: window.localStorage.getItem(LOCAL_STORAGE_ID) || "",
    hex: "",
    price: "",
    priceImport: "",
  };

  const {
    createColor,
    updateColor,
    deleteColor,
    action,
    show,
    setIsLoading,
    product,
  } = props;
  const [color, setColor] = useState(initData);
  const [isChange, setIsChange] = useState(false);
  const [title, setTitle] = useState("");
  const ref = useRef();

  // validate
  let [errors, setErrors] = useState([]);
  const [labelInputs, setLabelInputs] = useState([]);

  const handleInput = (e, label) => {
    setIsChange(true);

    // check input tag or select tag
    const { name, value } = e.target ? e.target : { name: label, value: e };

    const state =
      name == "colorName"
        ? { [name]: value, path: slugify(value, configSlugify) }
        : { [name]: value };

    setLabelInputs(name == "colorName" ? [name, "path"] : [name]);
    setColor({ ...color, ...state });
  };

  const handleImageRemove = (isReset) => {
    setIsChange(false);

    // remove input file value
    if (isReset) {
      // event refresh
      setErrors([]);
      setColor(initData);
    }
  };
  const getColor = async (id) => {
    const data = await ColorService.getById(id);
    setColor(data.data);
  };

  const onSave = async () => {
    const validate = colorModalValidator(color);
    if (validate.error) {
      const errors = getErrors(validate);
      setErrors(errors);
      setIsLoading(false);
    }

    if (!validate.error) {
      setIsLoading(true);

      if (!color._id) createColor(color);
      if (color._id) {
        updateColor(color._id, color);
      }

      handleImageRemove(true);
    }
  };

  // catch after event remove
  useEffect(() => {
    if (!isChange && JSON.stringify(props.showType) === JSON.stringify([1])) {
      handleImageRemove(true);
    }
  }, [isChange, props.isLoading]);

  // catch error when change input
  useEffect(() => {
    if (isChange) {
      const validate = colorModalValidator(color);
      setErrors(catchErrors(labelInputs, validate, errors));
    }
  }, [color]);

  useEffect(() => {
    setLabelInputs([]);
    setErrors([]);
    setTitle("Quản Lý Màu Sắc");
    handleImageRemove(true);
  }, [show, action, product._id]);

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
            <label className="form-label italic">Danh Sách Màu Sắc</label>

            <div className="flex justify-start items-center mt-[15px]">
              {props.product.colors &&
                props.product.colors.map((color, index) => (
                  <button
                    key={index}
                    style={{ background: color.hex }}
                    className="color-group__item shadow"
                    onClick={(e) => getColor(color._id)}
                  >
                    <i className="fa-regular fa-hand-pointer text-white opacity-0"></i>
                  </button>
                ))}
            </div>
            {/* <table className="table table-report -mt-2">
              <thead>
                <tr>
                  <th className="whitespace-nowrap capitalize text-center w-20">
                    STT
                  </th>
                  <th className="whitespace-nowrap capitalize ">
                    Tên Màu Sắc / Mã Màu (Hex)
                  </th>

                  <th className="text-center whitespace-nowrap capitalize ">
                    Giá Nhập / Giá Bán (VNĐ)
                  </th>
                  <th className="text-center whitespace-nowrap capitalize w-56">
                    Tác Vụ
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.product.colors &&
                  props.product.colors.map((color, index) => (
                    <tr className="intro-x" key={index}>
                      <td className="w-20 text-center">
                        {index + 1}
                      </td>
                      <td>
                        <a
                          href={undefined}
                          className="font-medium whitespace-nowrap"
                        >
                          {color.colorName} / {color.hex}
                        </a>
                      </td>
                      <td className="text-center">
                        {color.priceImport} / {color.price}
                      </td>

                      <td className="table-report__action w-56">
                        <div className="flex justify-center items-center">
                          <a
                            className="flex items-center mr-3"
                            href={undefined}
                          >
                            <i className="uil uil-edit"></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table> */}
          </div>
          <hr className="my-5" />
          <div className="grid grid-cols-2 gap-5">
            <div className="g-col-12 form-group">
              <label className="form-label italic">Màu sắc</label>
              <div className="color__picker">
                <SketchPicker
                  disableAlpha
                  color={color.hex}
                  presetColors={presetColors}
                  onChangeComplete={({ hex }) => {
                    setIsChange(true);
                    const { name } = getColorName(hex);
                    setLabelInputs(["colorName", "hex"]);
                    setColor({ ...color, colorName: name, hex: hex });
                    // window.localStorage.setItem(LOCAL_STORAGE_ID, hex);
                  }}
                />
              </div>
            </div>
            <div className="g-col-12 form-group">
              <label className="form-label italic">Thông tin</label>
              <div className="mt-[15px]">
                <button
                  className="button btn bg-slate-400"
                  disabled={!color._id ? true : false}
                  title="Kích Cỡ"
                  onClick={() => props.handleShowOverlap(color, [1, 2])}
                >
                  <i className="uil uil-expand-alt"></i>
                </button>
                <button
                  className="button btn ml-3 bg-slate-400"
                  disabled={!color._id ? true : false}
                  title="Ảnh"
                  onClick={() => props.handleShowOverlap(color, [1, 3])}
                >
                  <i className="uil uil-image-v"></i>
                </button>
                <button
                  className="button btn ml-3 bg-slate-400"
                  disabled={!color._id ? true : false}
                  title="Giảm Giá"
                  onClick={() => props.handleShowOverlap(color, [1, 4])}
                >
                  <i className="uil uil-percentage"></i>
                </button>
              </div>
              <div>
                <div className="g-col-12 form-group">
                  <input
                    type="text"
                    name="colorName"
                    className={"form-control shadow-lg border-[#cccccc]"}
                    style={{
                      background: color.hex && color.hex,
                    }}
                    readOnly
                  />
                </div>
                <div className="g-col-12 form-group">
                  <label className="form-label italic">Tên màu sắc (*)</label>
                  <input
                    type="text"
                    name="colorName"
                    className={
                      "form-control shadow-lg " +
                      (showError(errors, "colorName")
                        ? "border-[#FF0000] focusError"
                        : "border-[#cccccc]")
                    }
                    placeholder="/the-thao, /viec-lam"
                    required
                    value={color.colorName}
                    onChange={handleInput}
                  />
                  <small className="text-red-600">
                    {showError(errors, "colorName") &&
                      showError(errors, "colorName").messages.map(
                        (message, index) => (
                          <div key={index}>&bull; {message}</div>
                        )
                      )}
                  </small>
                </div>
                <div className="g-col-12 form-group">
                  <label className="form-label italic">Mã màu (hex) (*)</label>
                  <input
                    type="text"
                    name="hex"
                    className={
                      "form-control shadow-lg " +
                      (showError(errors, "hex")
                        ? "border-[#FF0000] focusError"
                        : "border-[#cccccc]")
                    }
                    placeholder="/the-thao, /viec-lam"
                    required
                    value={color.hex}
                    onChange={handleInput}
                  />
                  <small className="text-red-600">
                    {showError(errors, "hex") &&
                      showError(errors, "hex").messages.map(
                        (message, index) => (
                          <div key={index}>&bull; {message}</div>
                        )
                      )}
                  </small>
                </div>
                <div className="g-col-12 form-group">
                  <label className="form-label italic">
                    Giá nhập (VNĐ) (*)
                  </label>
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
                    value={color.priceImport || "(chưa có giá nhập)"}
                    onChange={handleInput}
                    readOnly
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
                <div className="g-col-12 form-group">
                  <label className="form-label italic">Giá bán (VNĐ) (*)</label>
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
                    value={color.price}
                    onChange={handleInput}
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
              <div className="mt-[15px]">
                <button
                  onClick={onSave}
                  // className="button btn btn-primary ml-3"
                  className={
                    props.isLoading
                      ? "button btn btn-primary button__loading loading"
                      : "button btn btn-primary button__loading"
                  }
                  disabled={props.isLoading}
                  title={color._id === "" ? "Thêm" : "Cập Nhật"}
                >
                  {/* {color._id === "" ? "Thêm" : "Cập Nhật"} */}
                  {color._id === "" ? (
                    <i className="uil uil-plus"></i>
                  ) : (
                    <i className="uil uil-pen"></i>
                  )}
                </button>
                <button
                  className={
                    // props.isDeleted
                    // ? "button btn btn-danger ml-3 button__loading loading"
                    // :
                    "button btn btn-danger ml-3 button__loading"
                  }
                  onClick={() => {
                    deleteColor(color._id);
                    // handleImageRemove(true);
                  }}
                  disabled={color._id === "" || props.isLoading ? true : false}
                  title="Xóa"
                >
                  {/* Xóa */}
                  <i className="uil uil-trash"></i>
                </button>
                <button
                  className="button btn btn-secondary ml-3"
                  disabled={false}
                  onClick={(e) => handleImageRemove(true)}
                  title="Làm Mới"
                >
                  {/* Làm mới */}
                  <i className="uil uil-refresh"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ColorModal;
