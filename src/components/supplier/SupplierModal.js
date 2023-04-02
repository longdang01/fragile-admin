import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { supplierModalValidator } from "../../common/Validation";
import {
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SunEditor from "suneditor-react";

import Modal from "../../utils/modal/Modal";
import UploadService from "../../services/upload.service";
var slugify = require("slugify");

const SupplierModal = (props) => {
  const initData = {
    _id: "",
    supplierName: "",
    picture: "",
    address: "",
    phone: "",
    email: "",
    description: "",
  };

  const initImage = { preview: "", raw: "" };

  const { createSupplier, updateSupplier, action, show, setIsLoading } = props;
  const [supplier, setSupplier] = useState(initData);
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
    setSupplier({ ...supplier, ...state });
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
        setSupplier({ ...supplier, ["picture"]: "" });
      }
    }

    // remove input file value
    if (isReset && ref.current) {
      ref.current.value = "";
      setImage(initImage);
      setSupplier(initData);
    }
  };

  const onSave = async () => {
    const validate = supplierModalValidator(supplier);

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

      supplier.picture =
        uploaded && uploaded.data.data
          ? uploaded.data.data.url
          : supplier.picture;

      if (action == 0) createSupplier(supplier);
      if (action == 1) updateSupplier(supplier._id, supplier);
    }
  };

  // catch error when change input
  useEffect(() => {
    const validate = supplierModalValidator(supplier);
    setErrors(catchErrors(labelInputs, validate, errors));
  }, [supplier]);

  useEffect(() => {
    handleImageRemove(true);
    setLabelInputs([]);
    setErrors([]);

    if (action == 1 && props.supplier._id) {
      setSupplier(props.supplier);
      setImage({ ...image, preview: props.supplier.picture, raw: "" });
      setTitle("Cập Nhật Nhà Cung Cấp");
    }

    if (action == 0 && !props.supplier._id) {
      setSupplier(initData);
      // handleImageRemove(true);
      setTitle("Thêm Nhà Cung Cấp");
    }
  }, [show, action, supplier._id]);

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
              <label className="form-label italic">Tên nhà cung cấp (*)</label>
              <input
                type="text"
                name="supplierName"
                className={
                  "form-control shadow-lg " +
                  (showError(errors, "supplierName")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                placeholder="Thể thao, Việc làm"
                required
                value={supplier.supplierName}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "supplierName") &&
                  showError(errors, "supplierName").messages.map(
                    (message, index) => <div key={index}>&bull; {message}</div>
                  )}
              </small>
            </div>
            <div className="g-col-12 form-group">
              <label className="form-label italic">Địa chỉ (*)</label>
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
                value={supplier.address}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "address") &&
                  showError(errors, "address").messages.map(
                    (message, index) => <div key={index}>&bull; {message}</div>
                  )}
              </small>
            </div>
            <div className="g-col-12 form-group">
              <label className="form-label italic">Điện thoại (*)</label>
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
                value={supplier.phone}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "phone") &&
                  showError(errors, "phone").messages.map((message, index) => (
                    <div key={index}>&bull; {message}</div>
                  ))}
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
                value={supplier.email}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "email") &&
                  showError(errors, "email").messages.map((message, index) => (
                    <div key={index}>&bull; {message}</div>
                  ))}
              </small>
            </div>
          </div>

          <div className="g-col-12 form-group">
            <label className="form-label italic">Hình ảnh</label>
            <input
              type="text"
              name="picture"
              className="form-control border-[#cccccc] shadow-lg mb-[8px]"
              required
              value={supplier.picture || "Chưa có hình ảnh"}
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
            <label className="form-label italic">Mô tả</label>
            <SunEditor
              autoFocus={false}
              defaultValue={action == 0 ? "" : supplier.description}
              setContents={action == 0 ? "" : supplier.description}
              onChange={(data) => {
                setSupplier((supplier) => {
                  // if (data == "<p><br></p>") {
                  //   data = "";
                  // }
                  return { ...supplier, description: data };
                });
              }}
              setOptions={configFullOptionSunEditor}
            />
            {/* <CKEditor
              editor={ClassicEditor}
              data={supplier.description || "<p></p>"}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                // console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();

                setSupplier({ ...supplier, description: data });
                // console.log({ event, editor, data });
              }}
              onBlur={(event, editor) => {
                // console.log("Blur.", editor);
              }}
              onFocus={(event, editor) => {
                // console.log("Focus.", editor);
              }}
            /> */}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SupplierModal;
