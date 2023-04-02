import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { staffModalValidator } from "../../common/Validation";
import {
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SunEditor from "suneditor-react";

import Modal from "../../utils/modal/Modal";
import UploadService from "../../services/upload.service";
var slugify = require("slugify");

const StaffModal = (props) => {
  const initData = {
    _id: "",
    staffName: "",
    picture: "",
    dob: "",
    address: "",
    phone: "",
  };

  const initImage = { preview: "", raw: "" };

  const { createStaff, updateStaff, action, show, setIsLoading } = props;
  const [staff, setStaff] = useState(initData);
  const [image, setImage] = useState(initImage);
  const [title, setTitle] = useState("");
  const ref = useRef();

  // validate
  let [errors, setErrors] = useState([]);
  const [labelInputs, setLabelInputs] = useState([]);

  const handleInput = (e, label) => {
    // check input tag or select tag
    const { name, value } = e.target ? e.target : { name: label, value: e };

    const state = { [name]: value };

    setLabelInputs([name]);
    setStaff({ ...staff, ...state });
  };

  const handleImage = (e) => {
    if (e.target.files.length > 0) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const handleImageRemove = (isReset) => {
    if (!isReset && ref.current) {
      let confirm = window.confirm("Bạn có chắc chắn xóa ảnh không?");
      if (confirm) {
        ref.current.value = "";
        setImage(initImage);
        setStaff({ ...staff, ["picture"]: "" });
      }
    }

    // remove input file value
    if (isReset && ref.current) {
      ref.current.value = "";
      setImage(initImage);
      setStaff(initData);
    }
  };

  const onSave = async () => {
    const validate = staffModalValidator(staff);

    if (validate.error) {
      const errors = getErrors(validate);
      setErrors(errors);
      setIsLoading(false);
    }

    if (!validate.error) {
      setIsLoading(true);

      let uploaded;
      if (image.raw) {
        uploaded = await UploadService.upload(image.raw);
      }

      staff.picture =
        uploaded && uploaded.data.data ? uploaded.data.data.url : staff.picture;

      if (action == 0) createStaff(staff);
      if (action == 1) updateStaff(staff._id, staff);
    }
  };

  // catch error when change input
  useEffect(() => {
    const validate = staffModalValidator(staff);
    setErrors(catchErrors(labelInputs, validate, errors));
  }, [staff]);

  useEffect(() => {
    handleImageRemove(true);
    setLabelInputs([]);
    setErrors([]);

    if (action == 1 && props.staff._id) {
      setStaff(props.staff);
      setImage({ ...image, preview: props.staff.picture, raw: "" });
      setTitle("Cập Nhật Nhân Viên");
    }

    if (action == 0 && !props.staff._id) {
      setStaff(initData);
      // handleImageRemove(true);
      setTitle("Thêm Nhân Viên");
    }
  }, [show, action, staff._id]);

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
          {/* <div className="g-col-12 form-group">
            <label className="form-label italic">Tên thương hiệu (*)</label>
            <input
              type="text"
              name="brandName"
              className={
                "form-control shadow-lg " +
                (showError(errors, "brandName")
                  ? "border-[#FF0000] focusError"
                  : "border-[#cccccc]")
              }
              placeholder="Thể thao, Việc làm"
              required
              value={staff.brandName}
              onChange={handleInput}
            />
            <small className="text-red-600">
              {showError(errors, "brandName") &&
                showError(errors, "brandName").messages.map(
                  (message, index) => <div key={index}>&bull; {message}</div>
                )}
            </small>
          </div>

          <div className="g-col-12 form-group">
            <label className="form-label italic">Hình ảnh</label>
            <input
              type="text"
              name="picture"
              className="form-control border-[#cccccc] shadow-lg mb-[8px]"
              required
              value={staff.picture || "Chưa có hình ảnh"}
              readOnly
            />
            <input
              type="file"
              accept="image/*"
              className="form-control form-image border-[#cccccc] shadow-lg mb-[8px]"
              onChange={handleImage}
              ref={ref}
            />
            {image.preview && (
              <div>
                <img src={image.preview} alt="Thumb" className="mb-[8px]" />
                <button
                  onClick={(e) => handleImageRemove(false)}
                  className="btn btn-secondary w-full"
                >
                  Xóa hình ảnh
                </button>
              </div>
            )}
            <small></small>
          </div> */}

          <div>Nhân Viên </div>
        </div>
      </Modal>
    </>
  );
};

export default StaffModal;
