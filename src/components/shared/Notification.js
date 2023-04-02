import { useState } from "react";

const Notification = (props) => {
  const [message, setMessage] = useState("Hiện chưa có thông báo !");
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <div className="intro-x dropdown mr-4 sm:mr-6">
        <div
          className="dropdown-toggle notification notification--bullet cursor-pointer"
          role="button"
          aria-expanded="false"
          data-tw-toggle="dropdown"
          onClick={() => setToggle(!toggle)}
        >
          {/* <i
            data-lucide="bell"
            className="notification__icon dark:text-slate-500"
          ></i> */}
          <i className="uil uil-bell"></i>
        </div>
        {/* Notification */}
        <div
          // className="notification-content pt-2 dropdown-menu"
          className={
            "notification-content pt-2 dropdown-menu " + (toggle ? "show" : "")
          }
        >
          <div className="notification-content__box dropdown-content">
            <div className="notification-content__title">Thông báo</div>

            <div>{message}</div>
            {/* <div className="cursor-pointer relative flex items-center">
            <div className="w-12 h-12 flex-none image-fit mr-1">
              <img
                alt="Midone - HTML Admin Template"
                className="rounded-full"
                src="http://icewall.left4code.com/dist/images/profile-2.jpg"
              />
              <div className="w-3 h-3 bg-success absolute right-0 bottom-0 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-2 overflow-hidden">
              <div className="flex items-center">
                <a href={undefined} className="font-medium truncate mr-5">
                  Johnny Depp
                </a>
                <div className="text-xs text-slate-400 ml-auto whitespace-nowrap">
                  01:10 PM
                </div>
              </div>
              <div className="w-full truncate text-slate-500 mt-0.5">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&#039;s standard
                dummy text ever since the 1500
              </div>
            </div>
          </div>
           */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
