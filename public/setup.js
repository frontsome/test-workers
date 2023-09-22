// import createApp method from Nue
import createApp from "./nue.js";

// import our compiled gallery component (the default export)
import Button from "./components/button.js";

// create a gallery app and feed it with data
const button = createApp(Button);

// select a root node for the component
const root = document.querySelector("#button");

// mount the instance on the page
button.mount(root);

// import our compiled gallery component (the default export)
import Form from "./components/form.js";

// create a gallery app and feed it with data
const form = createApp(Form);

// select a root node for the component
const root2 = document.querySelector("#form");

// mount the instance on the page
form.mount(root2);
