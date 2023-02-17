// @ts-ignore
const fs = require("fs-extra");
// @ts-ignore
const path = require("path");

const serverDir = path.join(__dirname, ".output", "server");
const functionDir = path.join(serverDir, "node_modules", "firebase-functions");
const nodeModulesDir = path.join(__dirname, "node_modules");

if (fs.existsSync(functionDir)) {
  if (fs.existsSync(nodeModulesDir)) {
    for (const name of ["firebase-functions", "semver"]) {
      fs.copySync(
        path.join(nodeModulesDir, name),
        path.join(serverDir, "node_modules", name)
      );
    }
    if (!fs.existsSync(path.join(serverDir, "node_modules", ".bin"))) {
      fs.mkdirSync(path.join(serverDir, "node_modules", ".bin"));
      fs.symlinkSync(
        path.join(functionDir, "lib", "bin", "firebase-functions.js"),
        path.join(serverDir, "node_modules", ".bin", "firebase-functions"),
        "file"
      );
    }
  }
}
