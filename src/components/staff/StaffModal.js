import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { staffModalValidator } from "../../common/Validation";
import {
  configSelectStyle,
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";
import * as moment from "moment";
import { ROLES } from "../../common/Variable";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select, { createFilter } from "react-select";
import SunEditor from "suneditor-react";

import Modal from "../../utils/modal/Modal";
import UserService from "../../services/user.service";
import UploadService from "../../services/upload.service";
var slugify = require("slugify");

const StaffModal = (props) => {
  const initData = {
    _id: "",
    user: "",
    staffName: "",
    picture: "",
    dob: "",
    address: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    role: "",
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
          <div className="grid grid-cols-2 gap-5">
            <div className="g-col-12 form-group">
              <label className="form-label italic">Tên nhân viên (*)</label>
              <input
                type="text"
                name="staffName"
                className={
                  "form-control shadow-lg " +
                  (showError(errors, "staffName")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                placeholder="Thể thao, Việc làm"
                required
                value={staff.staffName}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "staffName") &&
                  showError(errors, "staffName").messages.map(
                    (message, index) => <div key={index}>&bull; {message}</div>
                  )}
              </small>
            </div>
            <div className="g-col-12 form-group">
              <label className="form-label italic">Ngày sinh (*)</label>
              <input
                type="date"
                name="dob"
                className={
                  "form-control shadow-lg " +
                  (showError(errors, "dob")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                placeholder="Thể thao, Việc làm"
                required
                value={moment(staff.dob).format("YYYY-MM-DD")}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "dob") &&
                  showError(errors, "dob").messages.map((message, index) => (
                    <div key={index}>&bull; {message}</div>
                  ))}
              </small>
            </div>

            <div className="g-col-12 form-group">
              <label className="form-label italic">Username (*)</label>
              <input
                type="text"
                name="username"
                className={
                  "form-control shadow-lg " +
                  (showError(errors, "username")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                placeholder="Thể thao, Việc làm"
                required
                value={staff.username || ""}
                onChange={handleInput}
                disabled={action == 1}
              />
              <small className="text-red-600">
                {showError(errors, "username") &&
                  showError(errors, "username").messages.map(
                    (message, index) => <div key={index}>&bull; {message}</div>
                  )}
              </small>
            </div>
            <div className="g-col-12 form-group">
              <label className="form-label italic">Mật khẩu (*)</label>
              <input
                type="text"
                name="password"
                className={
                  "form-control shadow-lg " +
                  (showError(errors, "password")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                placeholder="Thể thao, Việc làm"
                required
                value={
                  action == 1
                    ? "(mật khẩu không được hiển thị)"
                    : staff.password
                }
                onChange={handleInput}
                disabled={action == 1}
              />
              <small className="text-red-600">
                {showError(errors, "password") &&
                  showError(errors, "password").messages.map(
                    (message, index) => <div key={index}>&bull; {message}</div>
                  )}
              </small>
            </div>
            <div className="g-col-12 form-group">
              <label className="form-label italic">Email (*)</label>
              <input
                type="text"
                name="email"
                className={
                  "form-control shadow-lg " +
                  (showError(errors, "email")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                placeholder="Thể thao, Việc làm"
                required
                value={staff.email || ""}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "email") &&
                  showError(errors, "email").messages.map((message, index) => (
                    <div key={index}>&bull; {message}</div>
                  ))}
              </small>
            </div>

            <div className="g-col-12 form-group">
              <label className="form-label italic">Số điện thoại (*)</label>
              <input
                type="text"
                name="phone"
                className={
                  "form-control shadow-lg " +
                  (showError(errors, "phone")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                placeholder="Thể thao, Việc làm"
                required
                value={staff.phone}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "phone") &&
                  showError(errors, "phone").messages.map((message, index) => (
                    <div key={index}>&bull; {message}</div>
                  ))}
              </small>
            </div>
          </div>

          <div className="g-col-12 form-group">
            <label className="form-label italic">Địa chỉ</label>
            <input
              type="text"
              name="address"
              className={
                "form-control shadow-lg " +
                (showError(errors, "address")
                  ? "border-[#FF0000] focusError"
                  : "border-[#cccccc]")
              }
              placeholder="Thể thao, Việc làm"
              required
              value={staff.address}
              onChange={handleInput}
            />
            <small className="text-red-600">
              {showError(errors, "address") &&
                showError(errors, "address").messages.map((message, index) => (
                  <div key={index}>&bull; {message}</div>
                ))}
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
          </div>
          <div className="g-col-12 form-group">
            <label className="form-label italic">Vai trò (*)</label>
            <Select
              styles={configSelectStyle}
              name="role"
              className={
                "form-control shadow-lg border-[2px] " +
                (showError(errors, "role")
                  ? "border-[#FF0000] focusError"
                  : "border-[#cccccc]")
              }
              onChange={(item) => handleInput(item ? item.value : "", "role")}
              value={
                staff.role
                  ? ROLES.find((item) => item.value == staff.role)
                  : null
              }
              options={ROLES}
              placeholder="Chọn phương thức thanh toán"
              filterOption={createFilter({
                matchFrom: "any",
                stringify: (option) => `${option.label}`,
              })}
              isSearchable={true}
              isClearable={true}
            />
            <small className="text-red-600">
              {showError(errors, "role") &&
                showError(errors, "role").messages.map((message, index) => (
                  <div key={index}>&bull; {message}</div>
                ))}
            </small>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StaffModal;
