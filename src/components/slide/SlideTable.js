import { useState, useMemo } from "react";
import { PAGE_SIZE } from "../../common/Variable";
import Pagination from "../../utils/pagination/Pagination";

const SlideTable = (props) => {
  const { slides, handleShow, deleteSlide } = props;

  const pageSize = PAGE_SIZE;
  const [currentPage, setCurrentPage] = useState(1);

  const data = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;

    return slides.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, slides]);

  return (
    <>
      <table className="table table-report -mt-2">
        <thead>
          <tr>
            <th className="whitespace-nowrap capitalize text-center w-20">
              STT
            </th>
            <th className="whitespace-nowrap capitalize w-40">Ảnh</th>
            <th className="whitespace-nowrap capitalize ">Tên Slide</th>
            <th className="whitespace-nowrap capitalize ">
              Đường Dẫn Chuyển Hướng
            </th>
            <th className="text-center whitespace-nowrap capitalize w-56">
              Tác Vụ
            </th>
          </tr>
        </thead>
        <tbody>
          {slides.length > 0 &&
            data.map((slide, index) => (
              <tr className="intro-x" key={index}>
                <td className="w-20 text-center">
                  {(currentPage - 1) * PAGE_SIZE + index + 1}
                </td>
                <td className="w-40">
                  {slide.picture ? (
                    <div className="flex">
                      <div className="w-10 h-10 image-fit zoom-in">
                        <img
                          alt=""
                          className="tooltip rounded-full"
                          src={slide.picture}
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
                    {slide.slideName || "(chưa có tên slide)"}
                  </a>
                  {/* <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    Photography
                  </div> */}
                </td>
                <td>
                  <a
                    href={slide.redirectLink || undefined}
                    className="font-medium whitespace-nowrap"
                    target="_blank"
                  >
                    {slide.redirectLink || "(chưa có đường dẫn)"}
                  </a>
                  {/* <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    Photography
                  </div> */}
                </td>
                <td className="table-report__action w-56">
                  <div className="flex justify-center items-center">
                    <a
                      className="flex items-center mr-3"
                      href={undefined}
                      onClick={() => handleShow(1, true, slide._id)}
                    >
                      <i className="uil uil-edit"></i>
                    </a>
                    <a
                      className="flex items-center text-danger"
                      href={undefined}
                      data-tw-toggle="modal"
                      data-tw-target="#delete-confirmation-modal"
                      onClick={() => deleteSlide(slide._id)}
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
        totalCount={props.slides.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default SlideTable;
