import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getErrors, showError, catchErrors } from "../../common/Error";
import { userModalValidator } from "../../common/Validation";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { TOAST_MESSAGE } from "../../common/Variable";
import { configToast } from "../../config/ConfigUI";
import UserService from "../../services/user.service";

const Login = () => {
  const initData = { username: "", password: "" };
  const [user, setUser] = useState(initData);
  let navigate = useNavigate();

  // validate
  let [errors, setErrors] = useState([]);
  const [labelInputs, setLabelInputs] = useState([]);

  const handleInput = (e) => {
    const { name, value } = e.target;

    setLabelInputs([name]);
    setUser({ ...user, [name]: value });
  };

  const login = () => {
    const validate = userModalValidator(user);

    if (validate.error) {
      const errors = getErrors(validate);
      setErrors(errors);
    }

    if (!validate.error) {
      UserService.login(user)
        .then((res) => {
          const user = res.data.user;

          if (user.role == 1) {
            // localStorage.setItem("ADMIN", JSON.stringify(res.data.staff));
            localStorage.setItem("ROLE", 1);
            // localStorage.setItem("ADMIN_JWT_TOKEN", user.token);
          }

          if (user.role == 2) {
            // localStorage.setItem("STAFF", JSON.stringify(res.data.staff));
            localStorage.setItem("ROLE", 2);
            // localStorage.setItem("IMPORT_JWT_TOKEN", user.token);
          }

          if (user.role == 3) {
            // localStorage.setItem("STAFF", JSON.stringify(res.data.staff));
            localStorage.setItem("ROLE", 3);
            // localStorage.setItem("SALES_JWT_TOKEN", user.token);
          }

          if (user.role == 4) {
            // localStorage.setItem("STAFF", JSON.stringify(res.data.staff));
            localStorage.setItem("ROLE", 4);
            // localStorage.setItem("MEDIA_JWT_TOKEN", user.token);
          }

          if (user.role == 5 && res.data.customer) {
            // localStorage.setItem("CUSTOMER_TOKEN", user.token);
            // localStorage.setItem("CUSTOMER", JSON.stringify(res.data.customer));
            // localStorage.setItem("ROLE", 5);
            toast.error(
              "Bạn không có quyền truy cập vào trang quản trị",
              configToast
            );
          }

          localStorage.setItem("TOKEN", user.token);
          localStorage.setItem("STAFF", JSON.stringify(res.data.staff));

          toast.success("Đăng nhập thành công !", configToast);
          navigate("/");
        })
        .catch((err) => {
          toast.error(err.response.data.message, configToast);
        });
    }
  };

  // catch error when change input
  useEffect(() => {
    const validate = userModalValidator(user);
    setErrors(catchErrors(labelInputs, validate, errors));
  }, [user]);

  return (
    <>
      <div className="login">
        <div className="container sm:px-10">
          <div className="block xl:grid grid-cols-2 gap-4">
            {/* <!-- BEGIN: Login Info --> */}
            <div className="hidden xl:flex flex-col min-h-screen">
              <a href="" className="-intro-x flex items-center pt-5">
                <img
                  alt="Midone - HTML Admin Template"
                  className="w-6"
                  src="http://icewall.left4code.com/dist/images/logo.svg"
                />
                <span className="text-white text-lg ml-3">FRAGILE</span>
              </a>
              <div className="my-auto">
                <img
                  alt="Midone - HTML Admin Template"
                  className="-intro-x w-1/2 -mt-16"
                  src="http://icewall.left4code.com/dist/images/illustration.svg"
                />
                <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                  A few more clicks to <br /> sign in to your account.
                </div>
                <div className="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">
                  Manage all your website in one place
                </div>
              </div>
            </div>
            {/* <!-- END: Login Info --> */}
            {/* <!-- BEGIN: Login Form --> */}
            <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
              <div className="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                  Đăng Nhập
                </h2>
                <div className="intro-x mt-2 text-slate-400 xl:hidden text-center">
                  {/* A few more clicks to sign in to your account. Manage all your
                  e-commerce accounts in one place */}
                </div>
                <div className="intro-x mt-8">
                  <div>
                    <input
                      type="text"
                      name="username"
                      // className="intro-x login__input form-control py-3 px-4 block"
                      className={
                        "intro-x login__input form-control py-3 px-4 block " +
                        (showError(errors, "username")
                          ? "border-[#FF0000] focusError"
                          : "border-[#cccccc]")
                      }
                      placeholder="Username"
                      onChange={handleInput}
                    />
                    <small className="text-red-600">
                      {showError(errors, "username") &&
                        showError(errors, "username").messages.map(
                          (message, index) => (
                            <div key={index}>&bull; {message}</div>
                          )
                        )}
                    </small>
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      // className="intro-x login__input form-control py-3 px-4 block mt-4"
                      className={
                        "intro-x login__input form-control py-3 px-4 block " +
                        (showError(errors, "password")
                          ? "border-[#FF0000] focusError"
                          : "border-[#cccccc]")
                      }
                      placeholder="Password"
                      onChange={handleInput}
                    />
                    <small className="text-red-600">
                      {showError(errors, "password") &&
                        showError(errors, "password").messages.map(
                          (message, index) => (
                            <div key={index}>&bull; {message}</div>
                          )
                        )}
                    </small>
                  </div>
                </div>
                {/* <div className="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4">
                  <div className="flex items-center mr-auto">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="form-check-input border mr-2"
                    />
                    <label
                      className="cursor-pointer select-none"
                      htmlFor="remember-me"
                    >
                      Remember me
                    </label>
                  </div>
                  <a href="">Forgot Password?</a>
                </div> */}
                <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                  <button
                    className="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top"
                    onClick={login}
                  >
                    Đăng Nhập
                  </button>
                  {/* <Link
                    to="/register"
                    className="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top"
                  >
                    Đăng Ký
                  </Link> */}
                </div>
                {/* <div className="intro-x mt-10 xl:mt-24 text-slate-600 dark:text-slate-500 text-center xl:text-left">
                  By signin up, you agree to our{" "}
                  <a className="text-primary dark:text-slate-200" href="">
                    Terms and Conditions
                  </a>{" "}
                  &amp;{" "}
                  <a className="text-primary dark:text-slate-200" href="">
                    Privacy Policy
                  </a>
                </div> */}
              </div>
            </div>
            {/* <!-- END: Login Form --> */}
          </div>
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
    </>
  );
};

export default Login;
