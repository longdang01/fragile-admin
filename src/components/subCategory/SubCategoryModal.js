import { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getOptions } from "../../common/Functions";
import {
  configSelectStyle,
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { subCategoryModalValidator } from "../../common/Validation";
import Select, { createFilter } from "react-select";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SunEditor from "suneditor-react";

import Modal from "../../utils/modal/Modal";
import UploadService from "../../services/upload.service";

var slugify = require("slugify");

const SubCategoryModal = (props) => {
  const initData = {
    _id: "",
    category: "",
    subCategoryName: "",
    picture: "",
    path: "",
    description: "",
  };

  const initImage = { preview: "", raw: "" };

  const { createSubCategory, updateSubCategory, action, show, setIsLoading } =
    props;

  const [subCategory, setSubCategory] = useState(initData);
  const [image, setImage] = useState(initImage);
  const [title, setTitle] = useState("");
  const ref = useRef();

  // select, option
  const [optionsCategory, setOptionsCategory] = useState([]);

  // validate
  let [errors, setErrors] = useState([]);
  const [labelInputs, setLabelInputs] = useState([]);

  const handleInput = (e, label) => {
    // check input tag or select tag
    const { name, value } = e.target ? e.target : { name: label, value: e };

    const state =
      name == "subCategoryName"
        ? { [name]: value, path: slugify(value, configSlugify) }
        : { [name]: value };

    setLabelInputs(name == "subCategoryName" ? [name, "path"] : [name]);
    setSubCategory({ ...subCategory, ...state });
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
        setSubCategory({ ...subCategory, ["picture"]: "" });
        ref.current.value = "";
        setImage(initImage);
      }
    }

    if (isReset && ref.current) {
      ref.current.value = "";
      setImage(initImage);
      setSubCategory(initData);
    }
  };

  const onSave = async () => {
    const validate = subCategoryModalValidator(subCategory);

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

      subCategory.picture =
        uploaded && uploaded.data.data
          ? uploaded.data.data.url
          : subCategory.picture;

      if (action == 0) createSubCategory(subCategory);
      if (action == 1) updateSubCategory(subCategory._id, subCategory);
    }
  };

  // catch error when change input
  useEffect(() => {
    const validate = subCategoryModalValidator(subCategory);
    setErrors(catchErrors(labelInputs, validate, errors));
  }, [subCategory]);

  useEffect(() => {
    // set options of category
    const optionsCategory = getOptions(props.categories, "categoryName");
    setOptionsCategory(optionsCategory);

    handleImageRemove(true);
    setLabelInputs([]);
    setErrors([]);

    if (action == 1 && props.subCategory._id) {
      setSubCategory(props.subCategory);
      setImage({ ...image, preview: props.subCategory.picture, raw: "" });
      setTitle("Cập Nhật Danh Mục Con");
    }

    if (action == 0 && !props.subCategory._id) {
      setSubCategory(initData);
      // handleImageRemove(true);
      setTitle("Thêm Danh Mục Con");
    }
  }, [show, action, subCategory._id]);

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
              <label className="form-label italic">Tên danh mục con (*)</label>
              <input
                type="text"
                name="subCategoryName"
                className={
                  "form-control shadow-lg " +
                  (showError(errors, "subCategoryName")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                placeholder="Bóng đá trong nước, Bóng đá châu âu"
                required
                value={subCategory.subCategoryName}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "subCategoryName") &&
                  showError(errors, "subCategoryName").messages.map(
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
                placeholder="bong-da-trong-nuoc, bong-da-chau-au"
                required
                value={subCategory.path}
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
            <label className="form-label italic">Tên danh mục cha (*)</label>
            <Select
              styles={configSelectStyle}
              name="category"
              className={
                "form-control shadow-lg border-[2px] " +
                (showError(errors, "category")
                  ? "border-[#FF0000] focusError"
                  : "border-[#cccccc]")
              }
              // onChange={(item) =>
              //   item
              //     ? handleSelect(item.value)
              //     : setSubCategory({ ...subCategory, ["category"]: "" })
              // }
              onChange={(item) =>
                handleInput(item ? item.value : "", "category")
              }
              value={
                subCategory.category
                  ? optionsCategory.find(
                      (item) =>
                        item.value == subCategory.category._id ||
                        item.value == subCategory.category
                    )
                  : null
              }
              options={optionsCategory}
              placeholder="Chọn danh mục cha"
              filterOption={createFilter({
                matchFrom: "any",
                stringify: (option) => `${option.label}`,
              })}
              isSearchable={true}
              isClearable={true}
            />
            {/* <select className="form-select w-full" name="category" required>
              <option>Chọn bộ sưu tập</option>
              <option></option>
            </select> */}
            <small className="text-red-600">
              {showError(errors, "category") &&
                showError(errors, "category").messages.map((message, index) => (
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
              value={subCategory.picture || "Chưa có hình ảnh"}
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
              defaultValue={action == 0 ? "" : subCategory.description}
              setContents={action == 0 ? "" : subCategory.description}
              onChange={(data) => {
                setSubCategory((subCategory) => {
                  // if (data == "<p><br></p>") {
                  //   data = "";
                  // }
                  return { ...subCategory, description: data };
                });
              }}
              setOptions={configFullOptionSunEditor}
            />
            {/* <CKEditor
              editor={ClassicEditor}
              data={subCategory.description || "<p></p>"}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                // console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();

                setSubCategory({ ...subCategory, description: data });
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

export default SubCategoryModal;
