import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { TOAST_MESSAGE, PAGE_SIZE } from "../../common/Variable";
import { configToast } from "../../config/ConfigUI";
import { Helmet, HelmetProvider } from "react-helmet-async";
import BrandTable from "./BrandTable";
import BrandModal from "./BrandModal";
import BrandService from "../../services/brand.service";
import ConfirmDialog from "../shared/ConfirmDialog";

const TITLE = "Quản Lý Thương Hiệu";
const TITLE_NAME = "Thương Hiệu";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState({});
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemDelete, setItemDelete] = useState();
  const [action, setAction] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const [page, setPage] = useState(1);
  // const [pageSize, setPageSize] = useState(PAGE_SIZE);
  // const [count, setCount] = useState(0);

  const handleSearch = (e) => {
    setSearchData(e);
  };

  const handleShow = async (action, show, id) => {
    const data = id ? await getBrand(id) : {};
    setBrand(data);
    setAction(action);
    setShow(show);
  };

  const getBrands = () => {
    BrandService.search({
      searchData: searchData,
      // page: page,
      // pageSize: pageSize,
    })
      .then((res) => {
        // console.log(res.data);
        setBrands(res.data);
        // setBrands(res.data.brands);
        // setCount(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBrand = async (id) => {
    const data = await BrandService.getById(id);
    return data.data;
  };

  const createBrand = (brand) => {
    BrandService.create(brand)
      .then((res) => {
        setBrands([...brands, res.data]);
        // setCount(count + 1);
        setIsLoading(false);
        setShow(false);
        toast.success(TOAST_MESSAGE.success.create, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
  };

  const updateBrand = (id, brand) => {
    BrandService.update(id, brand)
      .then((res) => {
        setBrands(
          brands.map((item) => (item._id == res.data._id ? res.data : item))
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

  const deleteBrand = (id) => {
    // let confirm = window.confirm("Bạn có chắc chắn xóa không?");
    // if (confirm) {
    if (!showConfirm) {
      setItemDelete(id);
      setShowConfirm(true);
      return;
    }
    setIsLoading(true);
    BrandService.remove(itemDelete)
      .then((res) => {
        setBrands(brands.filter((brand) => brand._id !== itemDelete));
        // setCount(count - 1);
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
    getBrands();
  }, [
    searchData,
    // , page, pageSize, count
  ]);

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

      <BrandModal
        show={show}
        onClose={() => setShow(false)}
        action={action}
        brand={brand}
        createBrand={createBrand}
        updateBrand={updateBrand}
        isLoading={isLoading}
        setIsLoading={(state) => setIsLoading(state)}
      />

      <ConfirmDialog
        onSave={deleteBrand}
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
            {/* Hiển thị {brands.length} / {count} danh mục cha */}
            Hiển thị {PAGE_SIZE} / {brands.length}{" "}
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
              {/* <i class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"></i> */}
            </div>
          </div>
        </div>
        {/* <!-- BEGIN: Data List --> */}
        <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
          <BrandTable
            brands={brands}
            deleteBrand={deleteBrand}
            handleShow={handleShow}
            // onSetPage={(page) => setPage(page)}
            // page={page}
            // pageSize={pageSize}
            // count={count}
          />
        </div>
      </div>
    </>
  );
};

export default Brand;
