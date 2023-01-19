import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group"; //to add animation
import "./SideDrawer.css";
export default function SideDrawer(props) {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      {/* to tell CSSTransition when to show  classNames is different from className*/}
      <aside className="side-drawer" onClick={props.onClick}>
        {props.children}{" "}
      </aside>
    </CSSTransition>
  );
  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
}
