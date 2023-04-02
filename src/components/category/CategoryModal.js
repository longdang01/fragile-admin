import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { categoryModalValidator } from "../../common/Validation";
import {
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SunEditor from "suneditor-react";

import Modal from "../../utils/modal/Modal";
import UploadService from "../../services/upload.service";
var slugify = require("slugify");

const CategoryModal = (props) => {
  const initData = {
    _id: "",
    categoryName: "",
    picture: "",
    path: "",
    description: "",
  };

  const initImage = { preview: "", raw: "" };

  const { createCategory, updateCategory, action, show, setIsLoading } = props;
  const [category, setCategory] = useState(initData);
  const [image, setImage] = useState(initImage);
  const [title, setTitle] = useState("");
  const ref = useRef();

  // validate
  let [errors, setErrors] = useState([]);
  const [labelInputs, setLabelInputs] = useState([]);

  const handleInput = (e, label) => {
    // check input tag or select tag
    const { name, value } = e.target ? e.target : { name: label, value: e };

    const state =
      name == "categoryName"
        ? { [name]: value, path: slugify(value, configSlugify) }
        : { [name]: value };

    setLabelInputs(name == "categoryName" ? [name, "path"] : [name]);
    setCategory({ ...category, ...state });
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
        setCategory({ ...category, ["picture"]: "" });
      }
    }

    // remove input file value
    if (isReset && ref.current) {
      ref.current.value = "";
      setImage(initImage);
      setCategory(initData);
    }
  };

  const onSave = async () => {
    const validate = categoryModalValidator(category);

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

      category.picture =
        uploaded && uploaded.data.data
          ? uploaded.data.data.url
          : category.picture;

      if (action == 0) createCategory(category);
      if (action == 1) updateCategory(category._id, category);
    }
  };

  // catch error when change input
  useEffect(() => {
    const validate = categoryModalValidator(category);
    setErrors(catchErrors(labelInputs, validate, errors));
  }, [category]);

  useEffect(() => {
    handleImageRemove(true);
    setLabelInputs([]);
    setErrors([]);

    if (action == 1 && props.category._id) {
      setCategory(props.category);
      setImage({ ...image, preview: props.category.picture, raw: "" });
      setTitle("Cập Nhật Danh Mục Cha");
    }

    if (action == 0 && !props.category._id) {
      setCategory(initData);
      // handleImageRemove(true);
      setTitle("Thêm Danh Mục Cha");
    }
  }, [show, action, category._id]);

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
              <label className="form-label italic">Tên danh mục cha (*)</label>
              <input
                type="text"
                name="categoryName"
                className={
                  "form-control shadow-lg " +
                  (showError(errors, "categoryName")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                placeholder="Thể thao, Việc làm"
                required
                value={category.categoryName}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "categoryName") &&
                  showError(errors, "categoryName").messages.map(
                    (message, index) => <div key={index}>&bull; {message}</div>
                  )}
              </small>
            </div>
            <div className="g-col-12 form-group">
              <label className="form-label italic">
                Đường dẫn (có thể tùy chỉnh) (*)
              </label>
              <input
                type="text"
                name="path"
                className={
                  "form-control shadow-lg " +
                  (showError(errors, "path")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                placeholder="/the-thao, /viec-lam"
                required
                value={category.path}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "path") &&
                  showError(errors, "path").messages.map((message, index) => (
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
              value={category.picture || "Chưa có hình ảnh"}
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
              defaultValue={action == 0 ? "" : category.description}
              setContents={action == 0 ? "" : category.description}
              onChange={(data) => {
                setCategory((category) => {
                  // if (data == "<p><br></p>") {
                  //   data = "";
                  // }
                  return { ...category, description: data };
                });
              }}
              setOptions={configFullOptionSunEditor}
            />
            {/* <CKEditor
              editor={ClassicEditor}
              data={category.description || "<p></p>"}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                // console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();

                setCategory({ ...category, description: data });
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

export default CategoryModal;
