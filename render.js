import { render, compileFile } from "nuejs-core";
import * as fs from "fs";

// define a component
const component = fs.readFileSync("./src/index.html", "utf8");

// render the component with some data
const html = render(component, {
  title: "Frontsome",
  body: "Frontsome is an awesome library of ui components",
  cta: "Get started",
  items: [{ name: "First item" }, { name: "Second item" }],
});

fs.writeFileSync("./public/index.html", html);

await compileFile("src/components/button.nue", "public/components/button.js");
await compileFile("src/components/form.nue", "public/components/form.js");

// console.info(html);
