import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../common/Variable";
import UserService from "../../services/user.service";
import avt from "../../assets/images/avt.jpg";

const AccountMenu = ({ staff }) => {
  // const [staff, setStaff] = useState();
  const [toggle, setToggle] = useState(false);
  let navigate = useNavigate();

  const logOut = () => {
    // if (staff.user.role == 1) {
    //   // localStorage.removeItem("ADMIN_JWT_TOKEN");
    //   // localStorage.removeItem("ADMIN");
    // }

    // if (staff.user.role == 2) {
    //   // localStorage.removeItem("IMPORT_JWT_TOKEN");
    //   // localStorage.removeItem("STAFF");
    // }

    // if (staff.user.role == 3) {
    //   // localStorage.removeItem("SALES_JWT_TOKEN");
    //   // localStorage.removeItem("STAFF");
    // }

    // if (staff.user.role == 4) {
    //   // localStorage.removeItem("MEDIA_JWT_TOKEN");
    //   // localStorage.removeItem("STAFF");
    // }

    localStorage.removeItem("TOKEN");
    localStorage.removeItem("ROLE");
    localStorage.removeItem("STAFF");

    navigate("/login");
  };
  // const hasToken = localStorage.getItem("TOKEN");

  // const getStaff = async (token) => {
  //   const data = hasToken && (await UserService.getMe());
  //   // console.log("me", data);
  //   // return staff: data.data.staff
  //   setStaff(data && data.data);
  //   // return data.data;
  // };

  // useEffect(() => {
  //   getStaff();
  // }, []);

  return (
    <>
      {staff && (
        <div className="intro-x dropdown w-8 h-8 account__menu">
          <div
            className="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110"
            role="button"
            aria-expanded="false"
            data-tw-toggle="dropdown"
            onClick={() => setToggle(!toggle)}
          >
            <img alt="" src={staff.staff?.picture || avt} />
          </div>
          <div className={"dropdown-menu w-56 " + (toggle ? "show" : "")}>
            <ul className="dropdown-content bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
              <li className="p-2">
                <div className="font-medium">{staff.staff?.staffName}</div>
                <div className="text-xs text-white/60 mt-0.5 dark:text-slate-500">
                  {ROLES.map(
                    (role, index) =>
                      staff.user?.role == Number(role.value) && (
                        <div key={index}>{role.label}</div>
                      )
                  )}
                </div>
              </li>
              {/* <li>
              <hr className="dropdown-divider border-white/[0.08]" />
            </li>
            <li>
              <a href="" className="dropdown-item hover:bg-white/5">
                <i data-lucide="user" className="w-4 h-4 mr-2"></i> Profile
              </a>
            </li>
            <li>
              <a href="" className="dropdown-item hover:bg-white/5">
                <i data-lucide="edit" className="w-4 h-4 mr-2"></i> Add Account
              </a>
            </li>
            <li>
              <a href="" className="dropdown-item hover:bg-white/5">
                <i data-lucide="lock" className="w-4 h-4 mr-2"></i> Reset
                Password
              </a>
            </li>
            <li>
              <a href="" className="dropdown-item hover:bg-white/5">
                <i data-lucide="help-circle" className="w-4 h-4 mr-2"></i> Help
              </a>
            </li> */}
              <li>
                <hr className="dropdown-divider border-white/[0.08]" />
              </li>
              <li>
                <a
                  href={undefined}
                  style={{ cursor: "pointer" }}
                  className="dropdown-item hover:bg-white/5"
                  onClick={logOut}
                >
                  {/* <i data-lucide="toggle-right" className="w-4 h-4 mr-2"></i> */}
                  <i className="uil uil-toggle-on mr-2"></i>
                  Đăng Xuất
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountMenu;
