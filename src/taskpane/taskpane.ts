/* @refresh reload */
import {
  fluentButton,
  fluentCard,
  provideFluentDesignSystem,
} from "@fluentui/web-components";
import { render } from "solid-js/web";
import { App } from "./app";
import "./taskpane.css";

provideFluentDesignSystem().register(fluentButton(), fluentCard());

const root = document.getElementById("root");

if (root) {
  render(App, root);
}
