import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { collectionImageModalValidator } from "../../common/Validation";
import {
  configSlugify,
  configFullOptionSunEditor,
} from "../../config/ConfigUI";
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SunEditor from "suneditor-react";
import Modal from "../../utils/modal/Modal";
import CollectionImageService from "../../services/collectionImage.service";
import UploadService from "../../services/upload.service";

// Import Swiper React components
var slugify = require("slugify");

const CollectionImageModal = (props) => {
  const initData = {
    _id: "",
    collectionInfo: props.collection._id,
    picture: "",
  };

  const initImage = { preview: "", raw: "" };

  const {
    createCollectionImage,
    updateCollectionImage,
    deleteCollectionImage,
    action,
    show,
    setIsLoading,
    collection,
  } = props;
  const [collectionImage, setCollectionImage] = useState(initData);
  const [isChange, setIsChange] = useState(false);
  const [openLightBox, setOpenLightBox] = useState(false);
  const [image, setImage] = useState(initImage);
  const [title, setTitle] = useState("");
  const ref = useRef();

  // validate
  let [errors, setErrors] = useState([]);
  const [labelInputs, setLabelInputs] = useState([]);

  const handleImage = (e) => {
    if (e.target.files.length > 0) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
      setIsChange(true);
      setLabelInputs(["picture"]);
      setCollectionImage({
        ...collectionImage,
        picture: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleImageRemove = (isReset) => {
    // refresh -> set isChange: false to stop validate
    setIsChange(false);
    if (!isReset && ref.current) {
      let confirm = window.confirm("Bạn có chắc chắn xóa ảnh không?");
      if (confirm) {
        ref.current.value = "";
        setImage(initImage);
        setCollectionImage({ ...collectionImage, ["picture"]: "" });
      }
    }

    // remove input file value
    if (isReset && ref.current) {
      ref.current.value = "";

      // event refresh
      setErrors([]);

      setImage(initImage);
      setCollectionImage(initData);
    }
  };

  const getCollectionImage = async (id) => {
    const data = await CollectionImageService.getById(id);
    setCollectionImage(data.data);
    setImage({ ...image, preview: data.data.picture, raw: "" });

    // return data.data;
  };

  const onSave = async () => {
    const validate = collectionImageModalValidator(collectionImage);
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
      collectionImage.picture =
        uploaded && uploaded.data.data
          ? uploaded.data.data.url
          : collectionImage.picture;
      if (!collectionImage._id) createCollectionImage(collectionImage);
      if (collectionImage._id)
        updateCollectionImage(collectionImage._id, collectionImage);

      handleImageRemove(true);
    }
  };

  // catch after event remove
  useEffect(() => {
    if (!isChange) {
      handleImageRemove(true);
    }
  }, [isChange, props.isLoading]);

  // catch error when change input
  useEffect(() => {
    if (isChange) {
      const validate = collectionImageModalValidator(collectionImage);
      setErrors(catchErrors(labelInputs, validate, errors));
    }
  }, [collectionImage, isChange]);

  useEffect(() => {
    handleImageRemove(true);
    setLabelInputs([]);
    setErrors([]);
    setTitle("Quản Lý Bộ Sưu Tập Ảnh");
  }, [show, action, collection._id]);

  return (
    <>
      <Modal
        onSave={onSave}
        title={title}
        onClose={props.onClose}
        show={props.show}
        disabledButtonSave={true}
        isLoading={props.isLoading}
      >
        <div className="height-[500px]">
          <div className="grid grid-cols-2 gap-5">
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
                value={collectionImage.picture || "Chưa có hình ảnh"}
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
                  <img
                    src={image.preview}
                    alt="Thumb"
                    className="h-[300px] object-cover w-full border-[#000000]
                    rounded border-2"
                    // onClick={() => setOpenLightBox(true)}
                  />
                </div>
              )}
              <small className="text-red-600">
                {showError(errors, "picture") &&
                  showError(errors, "picture").messages.map(
                    (message, index) => <div key={index}>&bull; {message}</div>
                  )}
              </small>
            </div>
            <div className="g-col-12 form-group">
              <label className="form-label italic">Tác vụ</label>

              <div>
                <button
                  onClick={onSave}
                  // className="button btn btn-primary ml-3"
                  className={
                    props.isLoading
                      ? "button btn btn-primary button__loading loading"
                      : "button btn btn-primary button__loading"
                  }
                  disabled={props.isLoading}
                  title={collectionImage._id === "" ? "Thêm" : "Cập Nhật"}
                >
                  {/* {collectionImage._id === "" ? "Thêm" : "Cập Nhật"} */}
                  {collectionImage._id === "" ? (
                    <i className="uil uil-plus"></i>
                  ) : (
                    <i className="uil uil-pen"></i>
                  )}
                </button>
                <button
                  className={
                    // props.isDeleted
                    //   ? "button btn btn-danger ml-3 button__loading loading"
                    "button btn btn-danger ml-3 button__loading"
                  }
                  onClick={() => {
                    deleteCollectionImage(collectionImage._id);
                    // handleImageRemove(true);
                    setIsChange(false);
                  }}
                  disabled={
                    collectionImage._id === "" || props.isLoading ? true : false
                  }
                  title="Xóa"
                >
                  {/* Xóa */}
                  <i className="uil uil-trash"></i>
                </button>
                <button
                  className="button btn btn-secondary ml-3"
                  disabled={false}
                  onClick={(e) => handleImageRemove(true)}
                  title="Làm Mới"
                >
                  {/* Làm mới */}
                  <i className="uil uil-refresh"></i>
                </button>
              </div>
            </div>
          </div>
          <hr className="my-5" />

          <div>
            <label className="form-label italic">Slide</label>

            {collection.collectionImages &&
              collection.collectionImages.length > 0 && (
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar, A11y]}
                  spaceBetween={30}
                  slidesPerView={2}
                  navigation={{
                    prevEl: ".collection__arrow--left",
                    nextEl: ".collection__arrow--right",
                  }}
                  // onSlideChange={() => console.log("slide change")}
                  // onSwiper={(swiper) => console.log(swiper)}
                >
                  {collection.collectionImages.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image.picture}
                        className="rounded shadow w-full h-[500px] object-cover collection__image"
                        onClick={(e) => getCollectionImage(image._id)}
                        alt=""
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            <small></small>
          </div>
          <div className="flex justify-end items-center">
            <button className="button btn btn-dark ml-3 collection__arrow--left">
              <i className="uil uil-angle-left-b"></i>
            </button>
            <button className="button btn btn-dark ml-3 collection__arrow--right">
              <i className="uil uil-angle-right-b"></i>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CollectionImageModal;
