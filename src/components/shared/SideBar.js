import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { menus } from "../../common/Menu";

const SideBar = ({ staff }) => {
  const { pathname } = useLocation();

  const toggleSideMenu = (e, sub) => {
    const subMenu = sub ? sub : e.target.closest("li").querySelector("ul");
    const icon = sub
      ? sub.closest("li").querySelector(".side-menu__sub-icon")
      : e.target.querySelector(".side-menu__sub-icon");

    // if (!sub) {
    //   icon.classList.toggle("rotate-180");
    // }

    // if (sub) {
    // const icon = sub.closest("li").querySelector(".side-menu__sub-icon");
    // icon.classList.add("rotate-180");
    // }

    if (subMenu.classList.contains("side-menu__sub-open") && !sub) {
      subMenu.style.height = "0px";

      subMenu.addEventListener(
        "transitionend",
        () => {
          subMenu.classList.remove("side-menu__sub-open");
          icon.classList.remove("rotate-180");
        },
        {
          once: true,
        }
      );
    } else {
      subMenu.classList.add("side-menu__sub-open");
      icon.classList.add("rotate-180");

      subMenu.style.height = "auto";

      var height = subMenu.clientHeight - 4 + "px";

      subMenu.style.height = height;
      // subMenu.style.height = "0px";

      // setTimeout(function () {
      //   subMenu.style.height = height;
      // }, 0);
    }
  };

  // useEffect(() => {
  // const ul = pathname.substring(1)
  //   ? document.querySelector(`.${pathname.substring(1)}`)
  //   : null;
  // if (ul) {
  //   // console.log(pathname.substring(1));
  //   [
  //     ...document.querySelectorAll(
  //       `.side-menu__sub-open:not(.${pathname.substring(1)})`
  //     ),
  //   ].map((x) => x.classList.remove("side-menu__sub-open"));
  //   ul.classList.add("side-menu__sub-open");
  //   toggleSideMenu(null, ul);
  // }

  //   if (document.querySelector(".side-menu__sub-open")) {
  //     toggleSideMenu(null, document.querySelector(".side-menu__sub-open"));
  //   }
  // }, []);

  useEffect(() => {
    const ul = pathname.substring(1)
      ? document.querySelector(`.${pathname.substring(1)}`)
      : null;

    if (ul) {
      // console.log(pathname.substring(1));
      [
        ...document.querySelectorAll(
          `.side-menu__sub-open:not(.${pathname.substring(1)})`
        ),
      ].map((x) => x.classList.remove("side-menu__sub-open"));
      ul.classList.add("side-menu__sub-open");
      toggleSideMenu(null, ul);
    }
  }, [pathname]);

  return (
    <>
      {staff && (
        <nav className="side-nav">
          <ul>
            {menus.map(
              (menu, index) =>
                menu.roles.includes(staff.user.role) && (
                  <li key={index}>
                    <NavLink
                      to={menu.to}
                      className={
                        menu.subMenus
                          .map((item) => item.to)
                          .includes(pathname) || [menu.to].includes(pathname)
                          ? `side-menu side-menu--active`
                          : `side-menu`
                      }
                      onClick={(e) =>
                        menu.subMenus.length > 0 ? toggleSideMenu(e) : null
                      }
                    >
                      <div className="side-menu__icon">
                        <i className={menu.icon}></i>
                      </div>
                      <div className="side-menu__title">
                        {menu.name}
                        {menu.subMenus.length > 0 && (
                          <div
                            className={
                              "side-menu__sub-icon transform " +
                              (menu.subMenus
                                .map((item) => item.to)
                                .includes(pathname)
                                ? "rotate-180"
                                : "")
                            }
                          >
                            <i className="fa-solid fa-chevron-down"></i>
                          </div>
                        )}
                      </div>
                    </NavLink>
                    {/* side-menu__sub-open */}
                    <ul
                      className={
                        "transition-height " +
                        (menu.subMenus.map((item) => item.to).includes(pathname)
                          ? `side-menu__sub-open ${pathname.substring(1)}`
                          : "")
                      }
                      // style={{
                      //   height:
                      //     menu.subMenus.map((item) => item.to).includes(pathname) ||
                      //     [menu.to].includes(pathname)
                      //       ? subMenuHeight.current
                      //       : "0px",
                      // }}
                    >
                      {menu.subMenus &&
                        menu.subMenus.map((subMenu, index) => {
                          return (
                            <li key={index}>
                              <NavLink
                                to={subMenu.to}
                                className={({ isActive }) =>
                                  isActive
                                    ? "side-menu side-menu--active"
                                    : "side-menu "
                                }
                              >
                                <div className="side-menu__icon">
                                  <i className={subMenu.icon}></i>
                                </div>
                                <div className="side-menu__title">
                                  {subMenu.name}
                                </div>
                              </NavLink>
                            </li>
                          );
                        })}
                    </ul>
                  </li>
                )
            )}
            <li className="side-nav__devider my-6"></li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default SideBar;
