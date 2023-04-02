import { useState, useMemo } from "react";
import { PAGE_SIZE } from "../../common/Variable";
import Pagination from "../../utils/pagination/Pagination";
import * as moment from "moment";
const OrdersTable = (props) => {
  const {
    orderses,
    handleShow,
    deleteOrders,
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

    return orderses.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, orderses]);

  return (
    <>
      <div>
        <table className="table table-report -mt-2">
          <thead>
            <tr>
              <th className="whitespace-nowrap capitalize text-center w-20">
                STT
              </th>
              <th className="whitespace-nowrap capitalize ">Mã Đơn Bán</th>
              <th className="whitespace-nowrap capitalize ">Ngày Bán</th>
              <th className="whitespace-nowrap capitalize ">Trạng Thái</th>
              <th className="text-center whitespace-nowrap capitalize w-56">
                Tác Vụ
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data.map((orders, index) => (
                <tr className="intro-x" key={index}>
                  <td className="w-20 text-center">
                    {/* {(page - 1) * pageSize + index + 1} */}
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </td>

                  <td>
                    <a
                      href={undefined}
                      className="font-medium whitespace-nowrap"
                    >
                      {orders.ordersCode}
                    </a>
                    {/* <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                      Photography
                    </div> */}
                  </td>
                  <td>{moment(orders.createdAt).format("DD/MM/YYYY")}</td>
                  <td>
                    {orders.paid == 1 ? (
                      <div className="text-green-600">(đã thanh toán)</div>
                    ) : (
                      <div className="text-danger">(chưa thanh toán)</div>
                    )}
                  </td>
                  <td className="table-report__action w-56">
                    <div className="flex justify-center items-center">
                      <a
                        className="flex items-center mr-3"
                        href={undefined}
                        onClick={() => handleShow(1, true, orders._id)}
                      >
                        <i className="uil uil-edit"></i>
                      </a>
                      <a
                        className="flex items-center text-danger"
                        href={undefined}
                        data-tw-toggle="modal"
                        data-tw-target="#delete-confirmation-modal"
                        onClick={() => deleteOrders(orders._id)}
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
          totalCount={orderses.length}
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

export default OrdersTable;
