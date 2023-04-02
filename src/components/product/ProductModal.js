import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { productModalValidator } from "../../common/Validation";
import { getOptions } from "../../common/Functions";
import {
  configSelectStyle,
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select, { createFilter } from "react-select";
import SunEditor from "suneditor-react";
import Modal from "../../utils/modal/Modal";
import UploadService from "../../services/upload.service";
var slugify = require("slugify");

const ProductModal = (props) => {
  const initData = {
    _id: "",
    subCategory: "",
    brand: "",
    collectionInfo: "",
    productName: "",
    path: "",
    origin: "",
    material: "",
    style: "",
    sizeGuide: "",
    description: "",
  };

  const initImage = { preview: "", raw: "" };

  const { createProduct, updateProduct, action, show, setIsLoading } = props;
  const [product, setProduct] = useState(initData);
  const [image, setImage] = useState(initImage);
  const [title, setTitle] = useState("");
  const ref = useRef();

  // select, option
  const [optionsSubCategory, setOptionsSubCategory] = useState([]);
  const [optionsBrand, setOptionsBrand] = useState([]);
  const [optionsSupplier, setOptionsSupplier] = useState([]);
  const [optionsCollection, setOptionsCollection] = useState([]);

  // validate
  let [errors, setErrors] = useState([]);
  const [labelInputs, setLabelInputs] = useState([]);

  const handleInput = (e, label) => {
    // check input tag or select tag
    const { name, value } = e.target ? e.target : { name: label, value: e };

    const state =
      name == "productName"
        ? { [name]: value, path: slugify(value, configSlugify) }
        : { [name]: value };

    setLabelInputs(name == "productName" ? [name, "path"] : [name]);
    setProduct({ ...product, ...state });
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
        setProduct({ ...product, ["sizeGuide"]: "" });
      }
    }

    // remove input file value
    if (isReset && ref.current) {
      ref.current.value = "";
      setImage(initImage);
      setProduct(initData);
    }
  };

  const onSave = async () => {
    const validate = productModalValidator(product);

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

      product.sizeGuide =
        uploaded && uploaded.data.data
          ? uploaded.data.data.url
          : product.sizeGuide;

      if (action == 0) createProduct(product);
      if (action == 1) updateProduct(product._id, product);
    }
  };

  // catch error when change input
  useEffect(() => {
    const validate = productModalValidator(product);
    setErrors(catchErrors(labelInputs, validate, errors));
  }, [product]);

  useEffect(() => {
    // set options
    const optionsSubCategory = getOptions(
      props.subCategories,
      "subCategoryName"
    );
    setOptionsSubCategory(optionsSubCategory);
    const optionsBrand = getOptions(props.brands, "brandName");
    setOptionsBrand(optionsBrand);
    const optionsSupplier = getOptions(props.suppliers, "supplierName");
    setOptionsSupplier(optionsSupplier);
    const optionsCollection = getOptions(props.collections, "collectionName");
    setOptionsCollection(optionsCollection);

    handleImageRemove(true);
    setLabelInputs([]);
    setErrors([]);

    if (action == 1 && props.product._id) {
      setProduct(props.product);
      setImage({ ...image, preview: props.product.sizeGuide, raw: "" });
      setTitle("Cập Nhật Sản Phẩm");
    }

    if (action == 0 && !props.product._id) {
      setProduct(initData);
      // handleImageRemove(true);
      setTitle("Thêm Sản Phẩm");
    }
  }, [show, action, product._id]);

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
              <label className="form-label italic">Tên sản phẩm (*)</label>
              <input
                type="text"
                name="productName"
                className={
                  "form-control shadow-lg " +
                  (showError(errors, "productName")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                placeholder="Thể thao, Việc làm"
                required
                value={product.productName}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "productName") &&
                  showError(errors, "productName").messages.map(
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
                value={product.path}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "path") &&
                  showError(errors, "path").messages.map((message, index) => (
                    <div key={index}>&bull; {message}</div>
                  ))}
              </small>
            </div>
            <div className="g-col-12 form-group">
              <label className="form-label italic">Nguồn gốc (*)</label>
              <input
                type="text"
                name="origin"
                className={
                  "form-control shadow-lg " +
                  (showError(errors, "origin")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                placeholder="/the-thao, /viec-lam"
                required
                value={product.origin}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "origin") &&
                  showError(errors, "origin").messages.map((message, index) => (
                    <div key={index}>&bull; {message}</div>
                  ))}
              </small>
            </div>
            <div className="g-col-12 form-group">
              <label className="form-label italic">Chất liệu (*)</label>
              <input
                type="text"
                name="material"
                className={
                  "form-control shadow-lg " +
                  (showError(errors, "material")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                placeholder="/the-thao, /viec-lam"
                required
                value={product.material}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "material") &&
                  showError(errors, "material").messages.map(
                    (message, index) => <div key={index}>&bull; {message}</div>
                  )}
              </small>
            </div>
            <div className="g-col-12 form-group">
              <label className="form-label italic">Phong cách (*)</label>
              <input
                type="text"
                name="style"
                className={
                  "form-control shadow-lg " +
                  (showError(errors, "style")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                placeholder="/the-thao, /viec-lam"
                required
                value={product.style}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "style") &&
                  showError(errors, "style").messages.map((message, index) => (
                    <div key={index}>&bull; {message}</div>
                  ))}
              </small>
            </div>
            <div className="g-col-12 form-group">
              <label className="form-label italic">Danh mục (*)</label>
              <Select
                styles={configSelectStyle}
                name="subCategory"
                className={
                  "form-control shadow-lg border-[2px] " +
                  (showError(errors, "subCategory")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                onChange={(item) =>
                  handleInput(item ? item.value : "", "subCategory")
                }
                value={
                  product.subCategory
                    ? optionsSubCategory.find(
                        (item) =>
                          item.value == product.subCategory._id ||
                          item.value == product.subCategory
                      )
                    : null
                }
                options={optionsSubCategory}
                placeholder="Chọn danh mục"
                filterOption={createFilter({
                  matchFrom: "any",
                  stringify: (option) => `${option.label}`,
                })}
                isSearchable={true}
                isClearable={true}
              />
              <small className="text-red-600">
                {showError(errors, "subCategory") &&
                  showError(errors, "subCategory").messages.map(
                    (message, index) => <div key={index}>&bull; {message}</div>
                  )}
              </small>
            </div>
            <div className="g-col-12 form-group">
              <label className="form-label italic">Thương hiệu (*)</label>
              <Select
                styles={configSelectStyle}
                name="brand"
                className={
                  "form-control shadow-lg border-[2px] " +
                  (showError(errors, "brand")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                onChange={(item) =>
                  handleInput(item ? item.value : "", "brand")
                }
                value={
                  product.brand
                    ? optionsBrand.find(
                        (item) =>
                          item.value == product.brand._id ||
                          item.value == product.brand
                      )
                    : null
                }
                options={optionsBrand}
                placeholder="Chọn thương hiệu"
                filterOption={createFilter({
                  matchFrom: "any",
                  stringify: (option) => `${option.label}`,
                })}
                isSearchable={true}
                isClearable={true}
              />
              <small className="text-red-600">
                {showError(errors, "brand") &&
                  showError(errors, "brand").messages.map((message, index) => (
                    <div key={index}>&bull; {message}</div>
                  ))}
              </small>
            </div>
            <div className="g-col-12 form-group">
              <label className="form-label italic">Nhà cung cấp (*)</label>
              <Select
                styles={configSelectStyle}
                name="supplier"
                className={
                  "form-control shadow-lg border-[2px] " +
                  (showError(errors, "supplier")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                onChange={(item) =>
                  handleInput(item ? item.value : "", "supplier")
                }
                value={
                  product.supplier
                    ? optionsSupplier.find(
                        (item) =>
                          item.value == product.supplier._id ||
                          item.value == product.supplier
                      )
                    : null
                }
                options={optionsSupplier}
                placeholder="Chọn nhà cung cấp"
                filterOption={createFilter({
                  matchFrom: "any",
                  stringify: (option) => `${option.label}`,
                })}
                isSearchable={true}
                isClearable={true}
              />
              <small className="text-red-600">
                {showError(errors, "supplier") &&
                  showError(errors, "supplier").messages.map(
                    (message, index) => <div key={index}>&bull; {message}</div>
                  )}
              </small>
            </div>
            <div className="g-col-12 form-group">
              <label className="form-label italic">Bộ sưu tập (*)</label>
              <Select
                styles={configSelectStyle}
                name="collectionInfo"
                className={
                  "form-control shadow-lg border-[2px] " +
                  (showError(errors, "collectionInfo")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                onChange={(item) =>
                  handleInput(item ? item.value : "", "collectionInfo")
                }
                value={
                  product.collectionInfo
                    ? optionsCollection.find(
                        (item) =>
                          item.value == product.collectionInfo._id ||
                          item.value == product.collectionInfo
                      )
                    : null
                }
                options={optionsCollection}
                placeholder="Chọn bộ sưu tập"
                filterOption={createFilter({
                  matchFrom: "any",
                  stringify: (option) => `${option.label}`,
                })}
                isSearchable={true}
                isClearable={true}
              />
              <small className="text-red-600">
                {showError(errors, "collectionInfo") &&
                  showError(errors, "collectionInfo").messages.map(
                    (message, index) => <div key={index}>&bull; {message}</div>
                  )}
              </small>
            </div>
          </div>

          <div className="g-col-12 form-group">
            <label className="form-label italic">
              Hình ảnh bảng chọn kích cỡ
            </label>
            <input
              type="text"
              name="sizeGuide"
              className="form-control border-[#cccccc] shadow-lg mb-[8px]"
              required
              value={product.sizeGuide || "Chưa có hình ảnh"}
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
              defaultValue={action == 0 ? "" : product.description}
              setContents={action == 0 ? "" : product.description}
              onChange={(data) => {
                setProduct((product) => {
                  // if (data == "<p><br></p>") {
                  //   data = "";
                  // }
                  return { ...product, description: data };
                });
              }}
              setOptions={configFullOptionSunEditor}
            />
            {/* <CKEditor
              editor={ClassicEditor}
              data={product.description || "<p></p>"}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                // console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();

                setProduct({ ...product, description: data });
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

export default ProductModal;
