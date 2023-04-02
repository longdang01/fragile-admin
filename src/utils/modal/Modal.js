import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import "./Modal.css";

const Modal = (props) => {
  const nodeRef = React.useRef(null);

  const closeOnEscapeKeyDown = (e) => {
    if (!props.isLoading) {
      if ((e.charCode || e.keyCode) === 27) {
        props.onClose();
      }
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, [props.isLoading]);

  return ReactDOM.createPortal(
    <CSSTransition
      in={props.show}
      timeout={{ enter: 0, exit: 300 }}
      nodeRef={nodeRef}
      unmountOnExit
    >
      <div
        className="customModal"
        // className={props.show ? "customModal enter-done" : "customModal exit"}
        onClick={!props.isLoading ? props.onClose : null}
        ref={nodeRef}
      >
        <div
          className="customModal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="customModal-header flex justify-between items-center">
            <h4 className="customModal-title font-bold text-[15px]">
              {props.title}
            </h4>
            {/* <button
              onClick={props.onClose}
              className="button btn btn-secondary"
            >
              <i class="uil uil-times"></i>
            </button> */}
          </div>
          <div
            className="customModal-body"
            style={{ height: props.isDialog ? "200px" : "350px" }}
          >
            {props.children}
          </div>
          <div className="customModal-footer flex justify-end items-center">
            <button
              onClick={!props.isLoading ? props.onClose : null}
              className="button btn btn-secondary ml-3"
            >
              Đóng
            </button>
            {!props.disabledButtonSave && (
              <button
                onClick={props.onSave}
                // className="button btn btn-primary ml-3"
                className={
                  props.isLoading
                    ? !props.actionSub
                      ? "button btn btn-primary ml-3 button__loading loading"
                      : props.actionSub != -1
                      ? "button btn btn-primary ml-3 button__loading loading"
                      : "button btn btn-primary ml-3 button__loading"
                    : "button btn btn-primary ml-3 button__loading"
                }
                disabled={props.isLoading}
              >
                {props.isDialog ? "Xóa" : "Lưu"}
              </button>
            )}
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
};

export default Modal;
