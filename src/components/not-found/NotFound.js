import { Helmet, HelmetProvider } from "react-helmet-async";
const TITLE = "Không Tìm Thấy Trang";
// const TITLE_NAME = "Đơn Bán";

const NotFound = () => {
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
      <div className="intro-y text-lg font-medium mt-10">
        Không tìm thấy trang
      </div>
    </>
  );
};

export default NotFound;
