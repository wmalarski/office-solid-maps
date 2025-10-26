/* @refresh reload */
import { render } from "solid-js/web";
import { App } from "./app";
import "./taskpane.css";

const root = document.getElementById("root");

if (root) {
  render(App, root);
}

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    document.getElementById("sideload-msg")!.style.display = "none";
    document.getElementById("app-body")!.style.display = "flex";
  }
});
