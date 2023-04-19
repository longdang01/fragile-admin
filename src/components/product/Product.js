import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { TOAST_MESSAGE, PAGE_SIZE } from "../../common/Variable";
import { configToast } from "../../config/ConfigUI";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import ColorModal from "./ColorModal";
import SizeModal from "./SizeModal";
import ColorImageModal from "./ColorImageModal";
import DiscountModal from "./DiscountModal";
import ProductService from "../../services/product.service";
import ConfirmDialog from "../shared/ConfirmDialog";
import ColorService from "../../services/color.service";
import SizeService from "../../services/size.service";
import ColorImageService from "../../services/colorImage.service";
import DiscountService from "../../services/discount.service";

const TITLE = "Quản Lý Sản Phẩm";
const TITLE_NAME = "Sản Phẩm";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [collections, setCollections] = useState([]);
  const [product, setProduct] = useState({});
  const [color, setColor] = useState({});
  const [show, setShow] = useState(false);
  // handle modal: overlap, separate issue
  const [showType, setShowType] = useState([0]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemDelete, setItemDelete] = useState();
  const [action, setAction] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [isDeleted, setIsDeleted] = useState(false);

  // const [page, setPage] = useState(1);
  // const [pageSize, setPageSize] = useState(PAGE_SIZE);
  // const [count, setCount] = useState(0);

  const handleSearch = (e) => {
    setSearchData(e);
  };

  const handleShow = async (action, show, id, type = [0]) => {
    const data = id ? await getProduct(id) : {};
    setProduct(data);
    setAction(action);
    setShow(show);
    setShowType(type);
  };

  const handleShowOverlap = async (color, type) => {
    setColor(color);
    setShowType(type);
  };

  const getProducts = () => {
    ProductService.search({
      searchData: searchData,
      // page: page,
      // pageSize: pageSize,
    })
      .then((res) => {
        // console.log(res.data);
        // setProducts(res.data);
        setProducts(res.data.products);
        setSubCategories(res.data.subCategories);
        setBrands(res.data.brands);
        setSuppliers(res.data.suppliers);
        setCollections(res.data.collections);
        // setCount(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProduct = async (id) => {
    const data = await ProductService.getById(id);
    return data.data;
  };

  const createProduct = (product) => {
    ProductService.create(product)
      .then((res) => {
        setProducts([res.data, ...products]);
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

  const updateProduct = (id, product) => {
    ProductService.update(id, product)
      .then((res) => {
        setProducts(
          products.map((item) => (item._id == res.data._id ? res.data : item))
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

  const deleteProduct = (id) => {
    // let confirm = window.confirm("Bạn có chắc chắn xóa không?");
    // if (confirm) {
    if (!showConfirm) {
      setItemDelete(id);
      setShowConfirm(true);
      return;
    }
    setIsLoading(true);

    ProductService.remove(itemDelete)
      .then((res) => {
        setProducts(products.filter((product) => product._id !== itemDelete));
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

  const createColor = (color) => {
    ColorService.create(color)
      .then((res) => {
        product.colors = [res.data, ...product.colors];
        setProduct(product);
        // setCount(count + 1);
        setIsLoading(false);
        // setShow(false);
        toast.success(TOAST_MESSAGE.success.create, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
  };

  const updateColor = (id, color) => {
    ColorService.update(id, color)
      .then((res) => {
        product.colors = product.colors.map((item) =>
          item._id == res.data._id ? res.data : item
        );
        setProduct(product);
        setIsLoading(false);
        // setShow(false);
        toast.success(TOAST_MESSAGE.success.update, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
  };

  const deleteColor = (id) => {
    // let confirm = window.confirm("Bạn có chắc chắn xóa không?");
    // if (confirm) {
    if (!showConfirm) {
      setItemDelete(id);
      setShowConfirm(true);
      return;
    }
    setIsLoading(true);
    // setIsDeleted(true);
    ColorService.remove(itemDelete)
      .then((res) => {
        console.log("delete color");
        product.colors = product.colors.filter(
          (item) => item._id !== itemDelete
        );
        setProduct(product);
        // setIsDeleted(false);
        setIsLoading(false);
        setShowConfirm(false);
        // setCount(count - 1);
        toast.success(TOAST_MESSAGE.success.delete, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
    // }
  };

  const createSize = (size) => {
    SizeService.create(size)
      .then((res) => {
        color.sizes = [...color.sizes, res.data];
        setColor(color);
        // setCount(count + 1);
        setIsLoading(false);
        // setShow(false);
        toast.success(TOAST_MESSAGE.success.create, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
  };

  const updateSize = (id, size) => {
    SizeService.update(id, size)
      .then((res) => {
        color.sizes = color.sizes.map((item) =>
          item._id == res.data._id ? res.data : item
        );
        setColor(color);
        setIsLoading(false);
        // setShow(false);
        toast.success(TOAST_MESSAGE.success.update, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
  };

  const deleteSize = (id) => {
    // let confirm = window.confirm("Bạn có chắc chắn xóa không?");
    // if (confirm) {
    if (!showConfirm) {
      setItemDelete(id);
      setShowConfirm(true);
      return;
    }

    setIsLoading(true);
    // setIsDeleted(true);
    SizeService.remove(itemDelete)
      .then((res) => {
        color.sizes = color.sizes.filter((item) => item._id !== itemDelete);
        setColor(color);
        // setIsDeleted(false);
        setIsLoading(false);
        setShowConfirm(false);
        // setCount(count - 1);
        toast.success(TOAST_MESSAGE.success.delete, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
    // }
  };

  const createColorImage = (colorImage) => {
    ColorImageService.create(colorImage)
      .then((res) => {
        color.images = [res.data, ...color.images];
        setColor(color);
        // setCount(count + 1);
        setIsLoading(false);
        // setShow(false);
        toast.success(TOAST_MESSAGE.success.create, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        toast.error(err.response.data.message, configToast);
      });
  };

  const updateColorImage = (id, size) => {
    ColorImageService.update(id, size)
      .then((res) => {
        color.images = color.images.map((item) =>
          item._id == res.data._id ? res.data : item
        );
        setColor(color);
        setIsLoading(false);
        // setShow(false);
        toast.success(TOAST_MESSAGE.success.update, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
  };

  const deleteColorImage = (id) => {
    // let confirm = window.confirm("Bạn có chắc chắn xóa không?");
    // if (confirm) {
    if (!showConfirm) {
      setItemDelete(id);
      setShowConfirm(true);
      return;
    }

    setIsLoading(true);
    // setIsDeleted(true);
    ColorImageService.remove(itemDelete)
      .then((res) => {
        color.images = color.images.filter((item) => item._id !== itemDelete);
        setColor(color);
        // setIsDeleted(false);
        setIsLoading(false);
        setShowConfirm(false);
        // setCount(count - 1);
        toast.success(TOAST_MESSAGE.success.delete, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
    // }
  };

  const createDiscount = (discount) => {
    DiscountService.create(discount)
      .then((res) => {
        color.discount = res.data;
        setColor(color);
        // setCount(count + 1);
        setIsLoading(false);
        // setShow(false);
        toast.success(TOAST_MESSAGE.success.create, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        toast.error(err.response.data.message, configToast);
      });
  };

  const updateDiscount = (id, size) => {
    DiscountService.update(id, size)
      .then((res) => {
        color.discount = res.data;
        setColor(color);
        setIsLoading(false);
        // setShow(false);
        toast.success(TOAST_MESSAGE.success.update, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
  };

  const deleteDiscount = (id) => {
    // let confirm = window.confirm("Bạn có chắc chắn xóa không?");
    // if (confirm) {
    if (!showConfirm) {
      setItemDelete(id);
      setShowConfirm(true);
      return;
    }

    setIsLoading(true);
    // setIsDeleted(true);
    DiscountService.remove(itemDelete)
      .then((res) => {
        color.discount = null;
        setColor(color);
        // setIsDeleted(false);
        setIsLoading(false);
        setShowConfirm(false);
        // setCount(count - 1);
        toast.success(TOAST_MESSAGE.success.delete, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
    // }
  };

  useEffect(() => {
    getProducts();
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
          <title>{TITLE + " / Fragile - Thương Hiệu Thời Trang Việt Nam"}</title>
        </Helmet>
      </HelmetProvider>

      <ProductModal
        show={showType.includes(0) && show}
        onClose={() => setShow(false)}
        action={action}
        product={product}
        subCategories={subCategories}
        brands={brands}
        suppliers={suppliers}
        collections={collections}
        createProduct={createProduct}
        updateProduct={updateProduct}
        isLoading={isLoading}
        setIsLoading={(state) => setIsLoading(state)}
      />

      <ColorModal
        show={showType.includes(1) && show}
        showType={showType}
        onClose={() => setShowType([])}
        action={action}
        product={product}
        handleShowOverlap={handleShowOverlap}
        createColor={createColor}
        updateColor={updateColor}
        deleteColor={deleteColor}
        isLoading={isLoading}
        // isDeleted={isDeleted}
        setIsLoading={(state) => setIsLoading(state)}
      />

      <SizeModal
        show={showType.includes(2) && show}
        onClose={() => setShowType([1])}
        action={action}
        color={color}
        createSize={createSize}
        updateSize={updateSize}
        deleteSize={deleteSize}
        isLoading={isLoading}
        // isDeleted={isDeleted}
        setIsLoading={(state) => setIsLoading(state)}
      />

      <ColorImageModal
        show={showType.includes(3) && show}
        onClose={() => setShowType([1])}
        action={action}
        color={color}
        createColorImage={createColorImage}
        updateColorImage={updateColorImage}
        deleteColorImage={deleteColorImage}
        isLoading={isLoading}
        // isDeleted={isDeleted}
        setIsLoading={(state) => setIsLoading(state)}
      />

      <DiscountModal
        show={showType.includes(4) && show}
        onClose={() => setShowType([1])}
        action={action}
        color={color}
        createDiscount={createDiscount}
        updateDiscount={updateDiscount}
        deleteDiscount={deleteDiscount}
        isLoading={isLoading}
        // isDeleted={isDeleted}
        setIsLoading={(state) => setIsLoading(state)}
      />

      <ConfirmDialog
        onSave={
          showType.includes(0) || !showType
            ? deleteProduct
            : JSON.stringify(showType) === JSON.stringify([1])
            ? deleteColor
            : JSON.stringify(showType) === JSON.stringify([1, 2])
            ? deleteSize
            : JSON.stringify(showType) === JSON.stringify([1, 3])
            ? deleteColorImage
            : JSON.stringify(showType) === JSON.stringify([1, 4])
            ? deleteDiscount
            : null
        }
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
            {/* Hiển thị {products.length} / {count} danh mục cha */}
            Hiển thị {PAGE_SIZE} / {products.length}{" "}
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
          <ProductTable
            products={products}
            deleteProduct={deleteProduct}
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

export default Product;
