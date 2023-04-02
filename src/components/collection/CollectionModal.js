import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { collectionModalValidator } from "../../common/Validation";
import {
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";
import * as moment from "moment";
import DatePicker from "react-datepicker";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SunEditor from "suneditor-react";

import Modal from "../../utils/modal/Modal";
import UploadService from "../../services/upload.service";
var slugify = require("slugify");

const CollectionModal = (props) => {
  const initData = {
    _id: "",
    collectionName: "",
    path: "",
    releaseDate: "",
    description: "",
  };

  const initImage = { preview: "", raw: "" };

  const { createCollection, updateCollection, action, show, setIsLoading } =
    props;
  const [collection, setCollection] = useState(initData);
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
      name == "collectionName"
        ? { [name]: value, path: slugify(value, configSlugify) }
        : { [name]: value };

    setLabelInputs(name == "collectionName" ? [name, "path"] : [name]);
    setCollection({ ...collection, ...state });
  };

  const onSave = async () => {
    const validate = collectionModalValidator(collection);

    if (validate.error) {
      const errors = getErrors(validate);
      setErrors(errors);
      setIsLoading(false);
    }

    if (!validate.error) {
      setIsLoading(true);

      if (action == 0) createCollection(collection);
      if (action == 1) updateCollection(collection._id, collection);
    }
  };

  // catch error when change input
  useEffect(() => {
    const validate = collectionModalValidator(collection);
    setErrors(catchErrors(labelInputs, validate, errors));
  }, [collection]);

  useEffect(() => {
    setLabelInputs([]);
    setErrors([]);

    if (action == 1 && props.collection._id) {
      setCollection(props.collection);
      setTitle("Cập Nhật Bộ Sưu Tập");
    }

    if (action == 0 && !props.collection._id) {
      setCollection(initData);
      setTitle("Thêm Bộ Sưu Tập");
    }
  }, [show, action, collection._id]);

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
              <label className="form-label italic">Tên bộ sưu tập (*)</label>
              <input
                type="text"
                name="collectionName"
                className={
                  "form-control shadow-lg " +
                  (showError(errors, "collectionName")
                    ? "border-[#FF0000] focusError"
                    : "border-[#cccccc]")
                }
                placeholder="Thể thao, Việc làm"
                required
                value={collection.collectionName}
                onChange={handleInput}
              />
              <small className="text-red-600">
                {showError(errors, "collectionName") &&
                  showError(errors, "collectionName").messages.map(
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
                value={collection.path}
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
            <label className="form-label italic">
              Ngày phát hành (Tháng/Ngày/Năm)
            </label>
            {/* <DatePicker
              selected={new Date(collection.releaseDate)}
              onChange={handleInput}
              dateFormat="dd/mm/yyyy"
            /> */}
            <input
              type="date"
              name="releaseDate"
              className={
                "form-control shadow-lg " +
                (showError(errors, "releaseDate")
                  ? "border-[#FF0000] focusError"
                  : "border-[#cccccc]")
              }
              placeholder="/the-thao, /viec-lam"
              required
              value={moment(collection.releaseDate).format("YYYY-MM-DD")}
              onChange={handleInput}
            />
            <small className="text-red-600">
              {showError(errors, "releaseDate") &&
                showError(errors, "releaseDate").messages.map(
                  (message, index) => <div key={index}>&bull; {message}</div>
                )}
            </small>
          </div>

          <div className="g-col-12 form-group">
            <label className="form-label italic">Mô tả</label>
            <SunEditor
              autoFocus={false}
              defaultValue={action == 0 ? "" : collection.description}
              setContents={action == 0 ? "" : collection.description}
              onChange={(data) => {
                setCollection((collection) => {
                  // if (data == "<p><br></p>") {
                  //   data = "";
                  // }
                  return { ...collection, description: data };
                });
              }}
              setOptions={configFullOptionSunEditor}
            />
            {/* <CKEditor
              editor={ClassicEditor}
              data={collection.description || "<p></p>"}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                // console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();

                setCollection({ ...collection, description: data });
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

export default CollectionModal;
