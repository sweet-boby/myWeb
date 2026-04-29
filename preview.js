const { cpSync, rmSync, mkdirSync } = require("fs");
const { execSync } = require("child_process");

rmSync("preview", { recursive: true, force: true });
mkdirSync("preview/myWeb", { recursive: true });
cpSync("out", "preview/myWeb", { recursive: true });
console.log(
  "\x1b[32m%s\x1b[0m",
  "Preview ready at http://localhost:3000/myWeb/",
);
execSync("npx serve preview -l 3000", { stdio: "inherit", shell: true });
