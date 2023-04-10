import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import TopBar from "../shared/TopBar";
import SideBar from "../shared/SideBar";
import UserService from "../../services/user.service";
import { useEffect, useState } from "react";

const Layout = () => {
  const [staff, setStaff] = useState();
  const hasToken = localStorage.getItem("TOKEN");

  const getStaff = async () => {
    const data = hasToken && (await UserService.getMe());
    // console.log("me", data);
    // return staff: data.data.staff
    setStaff(data && data.data);
    // return data.data;
  };

  useEffect(() => {
    getStaff();
  }, []);

  return (
    <>
      {staff && (
        <>
          {/* <!-- BEGIN: Mobile Menu */}

          {/* <!-- END: Mobile Menu */}
          {/* <!-- BEGIN: Top Bar */}
          <TopBar staff={staff} />
          {/* <!-- END: Top Bar */}
          <div className="wrapper">
            <div className="wrapper-box">
              {/* <!-- BEGIN: Side Menu */}
              <SideBar staff={staff} />

              {/* <!-- END: Side Menu */}
              {/* <!-- BEGIN: Content */}
              <div className="content">
                <Outlet />
              </div>
              {/* <!-- END: Content */}
            </div>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          {/* <!-- BEGIN: Dark Mode Switcher*/}

          {/* <!-- END: Dark Mode Switcher*/}
          {/* <!-- BEGIN: Main Color Switcher*/}

          {/* <!-- END: Main Color Switcher*/}
        </>
      )}
    </>
  );
};

export default Layout;
