import { useState, useMemo } from "react";
import { PAGE_SIZE } from "../../common/Variable";
import Pagination from "../../utils/pagination/Pagination";

const SubCategoryTable = (props) => {
  const { subCategories, handleShow, deleteSubCategory } = props;

  const pageSize = PAGE_SIZE;
  const [currentPage, setCurrentPage] = useState(1);

  const data = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;

    return subCategories.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, subCategories]);

  return (
    <>
      <table className="table table-report -mt-2">
        <thead>
          <tr>
            <th className="whitespace-nowrap capitalize text-center w-20">
              STT
            </th>
            <th className="whitespace-nowrap capitalize w-40">Ảnh</th>
            <th className="whitespace-nowrap capitalize ">Tên Danh Mục Con</th>
            <th className="text-center whitespace-nowrap capitalize ">
              Đường Dẫn
            </th>
            <th className="text-center whitespace-nowrap capitalize w-56">
              Tác Vụ
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((subCategory, index) => (
              <tr className="intro-x" key={index}>
                <td className="w-20 text-center">
                  {(currentPage - 1) * PAGE_SIZE + index + 1}
                </td>
                <td className="w-40">
                  {subCategory.picture ? (
                    <div className="flex">
                      <div className="w-10 h-10 image-fit zoom-in">
                        <img
                          alt=""
                          className="tooltip rounded-full"
                          src={subCategory.picture}
                          title="Uploaded at 5 October 2022"
                        />
                      </div>
                    </div>
                  ) : (
                    <small>(Chưa có ảnh)</small>
                  )}
                </td>
                <td>
                  <a href={undefined} className="font-medium whitespace-nowrap">
                    {subCategory.subCategoryName}
                  </a>
                  <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {subCategory.category
                      ? subCategory.category.categoryName
                      : "Cần cập nhật danh mục cha mới"}
                  </div>
                </td>
                <td className="text-center whitespace-nowrap">
                  {" "}
                  {subCategory.path}
                </td>
                <td className="table-report__action w-56">
                  <div className="flex justify-center items-center">
                    <a
                      className="flex items-center mr-3"
                      href={undefined}
                      onClick={() => handleShow(1, true, subCategory._id)}
                    >
                      <i className="uil uil-edit"></i>
                    </a>
                    <a
                      className="flex items-center text-danger"
                      href={undefined}
                      data-tw-toggle="modal"
                      data-tw-target="#delete-confirmation-modal"
                      onClick={() => deleteSubCategory(subCategory._id)}
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
        totalCount={props.subCategories.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default SubCategoryTable;
