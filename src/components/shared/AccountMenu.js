import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountMenu = () => {
  const [toggle, setToggle] = useState(false);
  let navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("id_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <div className="intro-x dropdown w-8 h-8 account__menu">
        <div
          className="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110"
          role="button"
          aria-expanded="false"
          data-tw-toggle="dropdown"
          onClick={() => setToggle(!toggle)}
        >
          <img
            alt="Midone - HTML Admin Template"
            src="http://icewall.left4code.com/dist/images/profile-6.jpg"
          />
        </div>
        <div className={"dropdown-menu w-56 " + (toggle ? "show" : "")}>
          <ul className="dropdown-content bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
            <li className="p-2">
              <div className="font-medium">Admin</div>
              <div className="text-xs text-white/60 mt-0.5 dark:text-slate-500">
                Admin
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
    </>
  );
};

export default AccountMenu;
