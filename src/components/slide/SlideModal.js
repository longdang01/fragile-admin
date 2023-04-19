import { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { slideModalValidator } from "../../common/Validation";
import {
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SunEditor from "suneditor-react";

import Modal from "../../utils/modal/Modal";

import UploadService from "../../services/upload.service";
var slugify = require("slugify");

const SlideModal = (props) => {
  const initData = {
    _id: "",
    slideName: "",
    picture: "",
    redirectLink: "",
    description: "",
  };

  const initImage = { preview: "", raw: "" };

  const { createSlide, updateSlide, action, show, setIsLoading } = props;
  const [slide, setSlide] = useState(initData);
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
    setSlide({ ...slide, ...state });
  };

  const handleImage = (e) => {
    if (e.target.files.length > 0) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
      setLabelInputs(["picture"]);
      setSlide({ ...slide, picture: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleImageRemove = (isReset) => {
    if (!isReset) {
      let confirm = window.confirm("Bạn có chắc chắn xóa ảnh không?");
      if (confirm) {
        ref.current.value = "";
        setImage(initImage);
        setSlide({ ...slide, ["picture"]: "" });
      }
    }

    // remove input file value
    if (isReset && ref.current) {
      ref.current.value = "";
      setImage(initImage);
      setSlide(initData);
    }
  };

  const onSave = async () => {
    const validate = slideModalValidator(slide);

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

      slide.picture =
        uploaded && uploaded.data.data ? uploaded.data.data.url : slide.picture;

      if (action == 0) createSlide(slide);
      if (action == 1) updateSlide(slide._id, slide);
    }
  };

  // catch error when change input
  useEffect(() => {
    const validate = slideModalValidator(slide);
    setErrors(catchErrors(labelInputs, validate, errors));
  }, [slide]);

  useEffect(() => {
    handleImageRemove(true);
    setLabelInputs([]);
    setErrors([]);

    if (action == 1 && props.slide._id) {
      setSlide(props.slide);
      setImage({ ...image, preview: props.slide.picture, raw: "" });
      setTitle("Cập Nhật Slide");
    }

    if (action == 0 && !props.slide._id) {
      setSlide(initData);
      // handleImageRemove(true);
      setTitle("Thêm Slide");
    }
  }, [show, action, slide._id]);

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
            <label className="form-label italic">Tên Slide</label>
            <input
              type="text"
              name="slideName"
              className={
                "form-control shadow-lg " +
                (showError(errors, "slideName")
                  ? "border-[#FF0000] focusError"
                  : "border-[#cccccc]")
              }
              placeholder="Thể thao, Việc làm"
              required
              value={slide.slideName}
              onChange={handleInput}
            />
            <small className="text-red-600">
              {showError(errors, "slideName") &&
                showError(errors, "slideName").messages.map(
                  (message, index) => <div key={index}>&bull; {message}</div>
                )}
            </small>
          </div>

          <div className="g-col-12 form-group">
            <label className="form-label italic">Đường dẫn chuyển hướng</label>
            <input
              type="text"
              name="redirectLink"
              className={"form-control shadow-lg border-[#cccccc]"}
              placeholder="Thể thao, Việc làm"
              required
              value={slide.redirectLink}
              onChange={handleInput}
            />
            <small className=""></small>
          </div>

          <div className="g-col-12 form-group">
            <label className="form-label italic">Hình ảnh</label>
            <input
              type="text"
              name="picture"
              className={
                "form-control shadow-lg mb-[8px] " +
                (showError(errors, "picture")
                  ? "border-[#FF0000] focusError"
                  : "border-[#cccccc]")
              }
              required
              value={slide.picture || "Chưa có hình ảnh"}
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
            <small className="text-red-600">
              {showError(errors, "picture") &&
                showError(errors, "picture").messages.map((message, index) => (
                  <div key={index}>&bull; {message}</div>
                ))}
            </small>
          </div>

          <div className="g-col-12 form-group">
            <label className="form-label italic">Mô tả</label>
            <SunEditor
              autoFocus={false}
              defaultValue={action == 0 ? "" : slide.description}
              setContents={action == 0 ? "" : slide.description}
              onChange={(data) => {
                setSlide((slide) => {
                  // if (data == "<p><br></p>") {
                  //   data = "";
                  // }
                  return { ...slide, description: data };
                });
              }}
              setOptions={configFullOptionSunEditor}
            />
            {/* <CKEditor
              editor={ClassicEditor}
              data={slide.description || "<p></p>"}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                // console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();

                setSlide({ ...slide, description: data });
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

export default SlideModal;
