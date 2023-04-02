import { useState, useMemo } from "react";
import { PAGE_SIZE } from "../../common/Variable";
import Pagination from "../../utils/pagination/Pagination";

const SupplierTable = (props) => {
  const {
    suppliers,
    handleShow,
    deleteSupplier,
    // page,
    // pageSize,
    // count,
    // onSetPage,
  } = props;

  const pageSize = PAGE_SIZE;
  const [currentPage, setCurrentPage] = useState(1);

  const data = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;

    return suppliers.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, suppliers]);

  return (
    <>
      <div>
        <table className="table table-report -mt-2">
          <thead>
            <tr>
              <th className="whitespace-nowrap capitalize text-center w-20">
                STT
              </th>
              <th className="whitespace-nowrap capitalize w-40">Ảnh</th>
              <th className="whitespace-nowrap capitalize ">
                Tên Nhà Cung Cấp
              </th>
              {/* <th className="whitespace-nowrap capitalize ">Địa Chỉ</th> */}
              <th className="whitespace-nowrap capitalize ">Điện Thoại</th>
              {/* <th className="whitespace-nowrap capitalize ">Email</th> */}
              <th className="text-center whitespace-nowrap capitalize w-56">
                Tác Vụ
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data.map((supplier, index) => (
                <tr className="intro-x" key={index}>
                  <td className="w-20 text-center">
                    {/* {(page - 1) * pageSize + index + 1} */}
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </td>
                  <td className="w-40">
                    {supplier.picture ? (
                      <div className="flex">
                        <div className="w-10 h-10 image-fit zoom-in">
                          <img
                            alt=""
                            className="tooltip rounded-full"
                            src={supplier.picture}
                            title="Uploaded at 5 October 2022"
                          />
                        </div>
                      </div>
                    ) : (
                      <small>(Chưa có ảnh)</small>
                    )}
                  </td>
                  <td>
                    <a
                      href={undefined}
                      className="font-medium whitespace-nowrap"
                    >
                      {supplier.supplierName}
                    </a>
                    {/* <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                      Photography
                    </div> */}
                  </td>
                  {/* <td>{supplier.address}</td> */}
                  <td>{supplier.phone}</td>
                  {/* <td>{supplier.email}</td> */}
                  <td className="table-report__action w-56">
                    <div className="flex justify-center items-center">
                      <a
                        className="flex items-center mr-3"
                        href={undefined}
                        onClick={() => handleShow(1, true, supplier._id)}
                      >
                        <i className="uil uil-edit"></i>
                      </a>
                      <a
                        className="flex items-center text-danger"
                        href={undefined}
                        data-tw-toggle="modal"
                        data-tw-target="#delete-confirmation-modal"
                        onClick={() => deleteSupplier(supplier._id)}
                      >
                        <i className="uil uil-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={suppliers.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
        {/* <Pagination
          className="pagination-bar"
          currentPage={page}
          totalCount={count}
          pageSize={pageSize}
          onPageChange={(page) => onSetPage(page)}
        /> */}
      </div>
    </>
  );
};

export default SupplierTable;
