import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { TOAST_MESSAGE, PAGE_SIZE } from "../../common/Variable";
import { configToast } from "../../config/ConfigUI";
import { Helmet, HelmetProvider } from "react-helmet-async";
import SlideTable from "./SlideTable";
import SlideModal from "./SlideModal";
import SlideService from "../../services/slide.service";
import ConfirmDialog from "../shared/ConfirmDialog";

const TITLE = "Quản Lý Slide";
const TITLE_NAME = "Slide";

const Slide = () => {
  const [slides, setSlides] = useState([]);
  const [slide, setSlide] = useState({});
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemDelete, setItemDelete] = useState();
  const [action, setAction] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => {
    setSearchData(e);
  };

  const handleShow = async (action, show, id) => {
    const data = id ? await getSlide(id) : {};
    setSlide(data);
    setAction(action);
    setShow(show);
  };

  const getSlides = () => {
    SlideService.search({ searchData: searchData })
      .then((res) => {
        setSlides(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSlide = async (id) => {
    const data = await SlideService.getById(id);
    return data.data;
  };

  const createSlide = (slide) => {
    SlideService.create(slide)
      .then((res) => {
        setSlides([res.data, ...slides]);
        setIsLoading(false);
        setShow(false);
        toast.success(TOAST_MESSAGE.success.create, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
  };

  const updateSlide = (id, slide) => {
    SlideService.update(id, slide)
      .then((res) => {
        setSlides(
          slides.map((item) => (item._id == res.data._id ? res.data : item))
        );
        setIsLoading(false);
        setShow(false);
        toast.success(TOAST_MESSAGE.success.update, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
  };

  const deleteSlide = (id) => {
    // let confirm = window.confirm("Bạn có chắc chắn xóa không?");
    // if (confirm) {
    if (!showConfirm) {
      setItemDelete(id);
      setShowConfirm(true);
      return;
    }
    setIsLoading(true);

    SlideService.remove(itemDelete)
      .then((res) => {
        setSlides(slides.filter((slide) => slide._id !== itemDelete));
        setIsLoading(false);
        setShowConfirm(false);
        toast.success(TOAST_MESSAGE.success.delete, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
    // }
  };

  useEffect(() => {
    getSlides();
  }, [searchData]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <meta charset="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <title>{TITLE + " / Fragile - Blog, News and Magazine"}</title>
        </Helmet>
      </HelmetProvider>

      <SlideModal
        show={show}
        onClose={() => setShow(false)}
        action={action}
        slide={slide}
        createSlide={createSlide}
        updateSlide={updateSlide}
        isLoading={isLoading}
        setIsLoading={(state) => setIsLoading(state)}
      />

      <ConfirmDialog
        onSave={deleteSlide}
        showConfirm={showConfirm}
        title={"Xác nhận xóa?"}
        onClose={() => setShowConfirm(false)}
        isLoading={isLoading}
        setIsLoading={(state) => setIsLoading(state)}
      />
      <h2 className="intro-y text-lg font-medium mt-10">
        <span className="capitalize">{TITLE}</span>
      </h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <button
            className="btn btn-primary shadow-md mr-2"
            onClick={() => handleShow(0, true, "")}
          >
            <span className="capitalize">Thêm {TITLE_NAME}</span>
          </button>

          <div className="hidden md:block mx-auto text-slate-500">
            Hiển thị {PAGE_SIZE} / {slides.length}{" "}
            <span className="lowercase">{TITLE_NAME}</span>
          </div>
          <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div className="w-56 relative text-slate-500">
              <input
                type="text"
                className="form-control w-56 box pr-10"
                placeholder="Tìm kiếm..."
                value={searchData}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <i className="uil uil-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"></i>
            </div>
          </div>
        </div>
        {/* <!-- BEGIN: Data List --> */}
        <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
          <SlideTable
            slides={slides}
            deleteSlide={deleteSlide}
            handleShow={handleShow}
          />
        </div>
      </div>
    </>
  );
};

export default Slide;
