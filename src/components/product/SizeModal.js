import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { sizeModalValidator } from "../../common/Validation";
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
import SizeService from "../../services/size.service";
import UploadService from "../../services/upload.service";

// Import Swiper React components
var slugify = require("slugify");

const SizeModal = (props) => {
  const initData = {
    _id: "",
    color: props.color._id,
    sizeName: "",
    quantity: 0,
  };

  const {
    createSize,
    updateSize,
    deleteSize,
    action,
    show,
    setIsLoading,
    color,
  } = props;
  const [size, setSize] = useState(initData);
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
      name == "sizeName"
        ? { [name]: value, path: slugify(value, configSlugify) }
        : { [name]: value };

    setLabelInputs(name == "sizeName" ? [name, "path"] : [name]);
    setSize({ ...size, ...state });
  };

  const handleImageRemove = (isReset) => {
    setIsChange(false);

    // remove input file value
    if (isReset) {
      // event refresh
      setErrors([]);
      setSize(initData);
    }
  };

  const getSize = async (id) => {
    const data = await SizeService.getById(id);
    setSize(data.data);
  };

  const onSave = async () => {
    const validate = sizeModalValidator(size);

    if (validate.error) {
      const errors = getErrors(validate);
      setErrors(errors);
      setIsLoading(false);
    }

    if (!validate.error) {
      setIsLoading(true);

      if (!size._id) createSize(size);
      if (size._id) {
        updateSize(size._id, size);
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
      const validate = sizeModalValidator(size);
      setErrors(catchErrors(labelInputs, validate, errors));
    }
  }, [size]);

  useEffect(() => {
    setLabelInputs([]);
    setErrors([]);
    setTitle("Quản Lý Kích Cỡ");
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
            <label className="form-label italic">Danh Sách Kích Cỡ</label>

            <div className="flex justify-start items-center mt-[15px]">
              {props.color.sizes &&
                props.color.sizes.map((size, index) => (
                  <button
                    key={index}
                    className="color-group__item color-group__item-size shadow"
                    onClick={(e) => getSize(size._id)}
                  >
                    {size.sizeName} ({size.quantity})
                    {/* <i className="fa-regular fa-hand-pointer text-white opacity-0"></i> */}
                  </button>
                ))}
            </div>
          </div>
          <hr className="my-5" />

          <div className="g-col-12 form-group">
            <label className="form-label italic">Thông tin</label>

            <div>
              <div className="g-col-12 form-group">
                <label className="form-label italic">Tên size (*)</label>
                <input
                  type="text"
                  name="sizeName"
                  className={
                    "form-control shadow-lg " +
                    (showError(errors, "sizeName")
                      ? "border-[#FF0000] focusError"
                      : "border-[#cccccc]")
                  }
                  placeholder="/the-thao, /viec-lam"
                  required
                  value={size.sizeName}
                  onChange={handleInput}
                />
                <small className="text-red-600">
                  {showError(errors, "sizeName") &&
                    showError(errors, "sizeName").messages.map(
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
                title={size._id === "" ? "Thêm" : "Cập Nhật"}
              >
                {size._id === "" ? (
                  <i className="uil uil-plus"></i>
                ) : (
                  <i className="uil uil-pen"></i>
                )}
              </button>
              <button
                className={"button btn btn-danger ml-3 button__loading"}
                onClick={() => {
                  deleteSize(size._id);
                }}
                disabled={size._id === "" || props.isLoading ? true : false}
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

export default SizeModal;
