const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const mapSource = fs.readFileSync(path.join(root, "screens", "06-local.jsx"), "utf8");

const checks = [
  {
    name: "real school identity is used",
    pass: /name:\s*"서울고등학교"/.test(mapSource) && /addr:\s*"서울특별시 서초구/.test(mapSource),
  },
  {
    name: "real facility coordinates are embedded",
    pass: /LC_REAL_FACILITIES\s*=\s*\[/.test(mapSource) && /lat:\s*37\./.test(mapSource) && /lng:\s*126\./.test(mapSource),
  },
  {
    name: "synthetic x/y coordinate conversion is not used for the real map",
    pass: !/LC_REAL_SCHOOL\.lat\s*\+\s*\(50\s*-\s*y\)/.test(mapSource),
  },
  {
    name: "map popup exposes facility address and source",
    pass: /resource\.addr/.test(mapSource) && /resource\.source/.test(mapSource),
  },
];

const failed = checks.filter((check) => !check.pass);

for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.name}`);
}

if (failed.length > 0) {
  process.exitCode = 1;
}
