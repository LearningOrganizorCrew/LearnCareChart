const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const files = [
  ["index.html", "index.html"],
  ["styles.css", "styles.css"],
  ["data.js", "data.js"],
  ["tweaks-panel.jsx", "tweaks-panel.jsx"],
  ["shared.jsx", "shared.jsx"],
  ["app.jsx", "app.jsx"],
  ["LearnCare_Chart_v.23.html", "LearnCare_Chart_v.23.html"],
  ["LearnCare_Chart_v29.html", "LearnCare_Chart_v29.html"],
  ["LearnCare_Chart_v30.html", "LearnCare_Chart_v30.html"],
];

const directories = ["screens", "screenshots"];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const [source, target] of files) {
  fs.copyFileSync(path.join(root, source), path.join(dist, target));
}

for (const directory of directories) {
  fs.cpSync(path.join(root, directory), path.join(dist, directory), {
    recursive: true,
  });
}

console.log(`Built static site in ${path.relative(root, dist)}`);
