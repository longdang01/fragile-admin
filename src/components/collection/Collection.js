import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { TOAST_MESSAGE, PAGE_SIZE } from "../../common/Variable";
import { configToast } from "../../config/ConfigUI";
import { Helmet, HelmetProvider } from "react-helmet-async";
import CollectionTable from "./CollectionTable";
import CollectionModal from "./CollectionModal";
import CollectionImageModal from "./CollectionImageModal";
import CollectionService from "../../services/collection.service";
import CollectionImageService from "../../services/collectionImage.service";
import ConfirmDialog from "../shared/ConfirmDialog";

const TITLE = "Quản Lý Bộ Sưu Tập";
const TITLE_NAME = "Bộ Sưu Tập";

const Collection = () => {
  const [collections, setCollections] = useState([]);
  const [collection, setCollection] = useState({});
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemDelete, setItemDelete] = useState();
  // handle modal: overlap, separate issue
  const [showType, setShowType] = useState([0]);

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
    const data = id ? await getCollection(id) : {};
    setCollection(data);
    setAction(action);
    setShow(show);
    setShowType(type);
  };

  const getCollections = () => {
    CollectionService.search({
      searchData: searchData,
      // page: page,
      // pageSize: pageSize,
    })
      .then((res) => {
        // console.log(res.data);
        setCollections(res.data);
        // setCollections(res.data.collections);
        // setCount(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCollection = async (id) => {
    const data = await CollectionService.getById(id);
    return data.data;
  };

  const createCollection = (collection) => {
    CollectionService.create(collection)
      .then((res) => {
        setCollections([res.data, ...collections]);
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

  const updateCollection = (id, collection) => {
    CollectionService.update(id, collection)
      .then((res) => {
        setCollections(
          collections.map((item) =>
            item._id == res.data._id ? res.data : item
          )
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

  const deleteCollection = (id) => {
    // let confirm = window.confirm("Bạn có chắc chắn xóa không?");
    // if (confirm) {
    if (!showConfirm) {
      setItemDelete(id);
      setShowConfirm(true);
      return;
    }
    setIsLoading(true);
    CollectionService.remove(itemDelete)
      .then((res) => {
        setCollections(
          collections.filter((collection) => collection._id !== itemDelete)
        );
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

  const createCollectionImage = (collectionImage) => {
    CollectionImageService.create(collectionImage)
      .then((res) => {
        collection.collectionImages = [
          res.data,
          ...collection.collectionImages,
        ];
        setCollection(collection);
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

  const updateCollectionImage = (id, collectionImage) => {
    CollectionImageService.update(id, collectionImage)
      .then((res) => {
        collection.collectionImages = collection.collectionImages.map((item) =>
          item._id == res.data._id ? res.data : item
        );
        setCollection(collection);
        setIsLoading(false);
        // setShow(false);
        toast.success(TOAST_MESSAGE.success.update, configToast);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message, configToast);
      });
  };

  const deleteCollectionImage = (id) => {
    // let confirm = window.confirm("Bạn có chắc chắn xóa không?");
    // if (confirm) {
    if (!showConfirm) {
      setItemDelete(id);
      setShowConfirm(true);
      return;
    }
    setIsLoading(true);
    // setIsDeleted(true);
    CollectionImageService.remove(itemDelete)
      .then((res) => {
        collection.collectionImages = collection.collectionImages.filter(
          (item) => item._id !== itemDelete
        );
        setCollection(collection);
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
    getCollections();
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
          <title>
            {TITLE + " / Fragile - Thương Hiệu Thời Trang Việt Nam"}
          </title>
        </Helmet>
      </HelmetProvider>

      <CollectionModal
        show={showType.includes(0) && show}
        onClose={() => setShow(false)}
        action={action}
        collection={collection}
        createCollection={createCollection}
        updateCollection={updateCollection}
        isLoading={isLoading}
        setIsLoading={(state) => setIsLoading(state)}
      />

      <CollectionImageModal
        show={showType.includes(1) && show}
        onClose={() => setShowType([])}
        action={action}
        collection={collection}
        createCollectionImage={createCollectionImage}
        updateCollectionImage={updateCollectionImage}
        deleteCollectionImage={deleteCollectionImage}
        isLoading={isLoading}
        // isDeleted={isDeleted}
        setIsLoading={(state) => setIsLoading(state)}
      />

      <ConfirmDialog
        onSave={
          showType.includes(0) || !showType
            ? deleteCollection
            : deleteCollectionImage
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
            {/* Hiển thị {collections.length} / {count} danh mục cha */}
            Hiển thị {PAGE_SIZE} / {collections.length}{" "}
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
          <CollectionTable
            collections={collections}
            deleteCollection={deleteCollection}
            handleShow={handleShow}
            // onSetPage={(page) => setPage(page)}
            // page={page}
            // pageSize={pageSize}
            // count={count}
          />
        </div>
        {/* <!-- END: Data List --> */}
        {/* <!-- BEGIN: Pagination --> */}
        {/* <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
          <nav className="w-full sm:w-auto sm:mr-auto">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#">
                  <i className="w-4 h-4" data-lucide="chevrons-left"></i>
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  <i className="w-4 h-4" data-lucide="chevron-left"></i>
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  ...
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item active">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  ...
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  <i className="w-4 h-4" data-lucide="chevron-right"></i>
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  <i className="w-4 h-4" data-lucide="chevrons-right"></i>
                </a>
              </li>
            </ul>
          </nav>
          <select className="w-20 form-select box mt-3 sm:mt-0">
            <option>10</option>
            <option>25</option>
            <option>35</option>
            <option>50</option>
          </select>
        </div> */}
        {/* <!-- END: Pagination --> */}
      </div>
      {/* <!-- BEGIN: Delete Confirmation Modal --> */}
      {/* <div id="delete-confirmation-modal" className="modal" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body p-0">
              <div className="p-5 text-center">
                <i
                  data-lucide="x-circle"
                  className="w-16 h-16 text-danger mx-auto mt-3"
                ></i>
                <div className="text-3xl mt-5">Are you sure?</div>
                <div className="text-slate-500 mt-2">
                  Do you really want to delete these records? <br />
                  This process cannot be undone.
                </div>
              </div>
              <div className="px-5 pb-8 text-center">
                <button
                  type="button"
                  data-tw-dismiss="modal"
                  className="btn btn-outline-secondary w-24 mr-1"
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-danger w-24">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <!-- END: Delete Confirmation Modal --> */}
    </>
  );
};

export default Collection;
