import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { getOptions } from "../../common/Functions";

import { lookbookModalValidator } from "../../common/Validation";
import {
  configSelectStyle,
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";
import Select, { createFilter } from "react-select";
import * as moment from "moment";
import DatePicker from "react-datepicker";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SunEditor from "suneditor-react";

import Modal from "../../utils/modal/Modal";
import UploadService from "../../services/upload.service";
var slugify = require("slugify");

const LookbookModal = (props) => {
  const initData = {
    _id: "",
    lookbookName: "",
    collectionInfo: "",
    description: "",
  };

  const initImage = { preview: "", raw: "" };

  const { createLookbook, updateLookbook, action, show, setIsLoading } = props;
  const [lookbook, setLookbook] = useState(initData);
  const [image, setImage] = useState(initImage);
  const [title, setTitle] = useState("");
  const ref = useRef();

  // select, option
  const [optionsCollection, setOptionsCollection] = useState([]);

  // validate
  let [errors, setErrors] = useState([]);
  const [labelInputs, setLabelInputs] = useState([]);

  const handleInput = (e, label) => {
    // check input tag or select tag
    const { name, value } = e.target ? e.target : { name: label, value: e };

    const state = { [name]: value };

    setLabelInputs([name]);
    setLookbook({ ...lookbook, ...state });
  };

  const onSave = async () => {
    const validate = lookbookModalValidator(lookbook);

    if (validate.error) {
      const errors = getErrors(validate);
      setErrors(errors);
      setIsLoading(false);
    }

    if (!validate.error) {
      setIsLoading(true);

      if (action == 0) createLookbook(lookbook);
      if (action == 1) updateLookbook(lookbook._id, lookbook);
    }
  };

  // catch error when change input
  useEffect(() => {
    const validate = lookbookModalValidator(lookbook);
    setErrors(catchErrors(labelInputs, validate, errors));
  }, [lookbook]);

  useEffect(() => {
    setLabelInputs([]);
    setErrors([]);
    const optionsCollection = getOptions(props.collections, "collectionName");
    setOptionsCollection(optionsCollection);

    if (action == 1 && props.lookbook._id) {
      setLookbook(props.lookbook);
      setTitle("Cập Nhật Lookbook");
    }

    if (action == 0 && !props.lookbook._id) {
      setLookbook(initData);
      setTitle("Thêm Lookbook");
    }
  }, [show, action, lookbook._id]);

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
            <label className="form-label italic">
              Thuộc collection nào? (*)
            </label>
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
                lookbook.collectionInfo
                  ? optionsCollection.find(
                      (item) =>
                        item.value == lookbook.collectionInfo._id ||
                        item.value == lookbook.collectionInfo
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
          <div className="g-col-12 form-group">
            <label className="form-label italic">Tên Lookbook (*)</label>
            <input
              type="text"
              name="lookbookName"
              className={
                "form-control shadow-lg " +
                (showError(errors, "lookbookName")
                  ? "border-[#FF0000] focusError"
                  : "border-[#cccccc]")
              }
              placeholder="Thể thao, Việc làm"
              required
              value={lookbook.lookbookName}
              onChange={handleInput}
            />
            <small className="text-red-600">
              {showError(errors, "lookbookName") &&
                showError(errors, "lookbookName").messages.map(
                  (message, index) => <div key={index}>&bull; {message}</div>
                )}
            </small>
          </div>

          <div className="g-col-12 form-group">
            <label className="form-label italic">Mô tả</label>
            <SunEditor
              autoFocus={false}
              defaultValue={action == 0 ? "" : lookbook.description}
              setContents={action == 0 ? "" : lookbook.description}
              onChange={(data) => {
                setLookbook((lookbook) => {
                  // if (data == "<p><br></p>") {
                  //   data = "";
                  // }
                  return { ...lookbook, description: data };
                });
              }}
              setOptions={configFullOptionSunEditor}
            />
            {/* <CKEditor
              editor={ClassicEditor}
              data={lookbook.description || "<p></p>"}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                // console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();

                setLookbook({ ...lookbook, description: data });
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

export default LookbookModal;
