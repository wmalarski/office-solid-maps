/* @refresh reload */
import { Component } from "solid-js";
import { render } from "solid-js/web";

const root = document.getElementById("root");

if (root) {
    render(() => <App />, root);
}

const App: Component = () => {
    return <span>Hello from solid</span>
}