import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { brandModalValidator } from "../../common/Validation";
import {
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SunEditor from "suneditor-react";

import Modal from "../../utils/modal/Modal";
import UploadService from "../../services/upload.service";
var slugify = require("slugify");

const BrandModal = (props) => {
  const initData = {
    _id: "",
    brandName: "",
    picture: "",
    description: "",
  };

  const initImage = { preview: "", raw: "" };

  const { createBrand, updateBrand, action, show, setIsLoading } = props;
  const [brand, setBrand] = useState(initData);
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
    setBrand({ ...brand, ...state });
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
        setBrand({ ...brand, ["picture"]: "" });
      }
    }

    // remove input file value
    if (isReset && ref.current) {
      ref.current.value = "";
      setImage(initImage);
      setBrand(initData);
    }
  };

  const onSave = async () => {
    const validate = brandModalValidator(brand);

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

      brand.picture =
        uploaded && uploaded.data.data ? uploaded.data.data.url : brand.picture;

      if (action == 0) createBrand(brand);
      if (action == 1) updateBrand(brand._id, brand);
    }
  };

  // catch error when change input
  useEffect(() => {
    const validate = brandModalValidator(brand);
    setErrors(catchErrors(labelInputs, validate, errors));
  }, [brand]);

  useEffect(() => {
    handleImageRemove(true);
    setLabelInputs([]);
    setErrors([]);

    if (action == 1 && props.brand._id) {
      setBrand(props.brand);
      setImage({ ...image, preview: props.brand.picture, raw: "" });
      setTitle("Cập Nhật Thương Hiệu");
    }

    if (action == 0 && !props.brand._id) {
      setBrand(initData);
      // handleImageRemove(true);
      setTitle("Thêm Thương Hiệu");
    }
  }, [show, action, brand._id]);

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
          <div className="g-col-12 form-group">
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
              value={brand.brandName}
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
              value={brand.picture || "Chưa có hình ảnh"}
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
              defaultValue={action == 0 ? "" : brand.description}
              setContents={action == 0 ? "" : brand.description}
              onChange={(data) => {
                setBrand((brand) => {
                  // if (data == "<p><br></p>") {
                  //   data = "";
                  // }
                  return { ...brand, description: data };
                });
              }}
              setOptions={configFullOptionSunEditor}
            />
            {/* <CKEditor
              editor={ClassicEditor}
              data={brand.description || "<p></p>"}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                // console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();

                setBrand({ ...brand, description: data });
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

export default BrandModal;
