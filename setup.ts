// @ts-ignore
const fs = require("node:fs");
// @ts-ignore
const path = require("node:path");
// @ts-ignore
const readline = require("readline");

async function readInput(
  question: string,
  orDefault: string = ""
  //
): Promise<string> {
  return new Promise((resolve) => {
    const cli = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    cli.question(`${question?.trim()} `, (answer: string) => {
      if (!answer) {
        resolve(orDefault);
      } else {
        resolve(answer);
      }
      cli.close();
    });
  });
}

async function main() {
  const projectId = await readInput(
    "Enter project ID:",
    path.basename(process.cwd())
    //
  );
  const siteName = await readInput(
    "Enter site name: (e.g. enter my-site for my-site.web.app)",
    projectId
    //
  );
  // const nodeEngine = "16";
  const nodeEngine = await readInput(
    "Enter node engine version: (e.g. enter 16 for nodejs16)",
    "16"
    //
  );

  editJson(".firebaserc", (json) => {
    json.projects = {
      ...(json.projects || {
        default: projectId,
      }),
    };
  });

  editJson("package.json", (json) => {
    json.name = siteName;
    json.author = json.author || process.env.USER;
    json.engines = {
      ...(json.engines || {
        node: ">= " + nodeEngine,
        //
      }),
    };
    if ("prettier" in json.devDependencies) {
      editJson(
        ".prettierrc",
        () => {}
        //
      );
    }
  });

  editJson("firebase.json", (json) => {
    json.hosting = {
      ...(json.hosting || {}),
      site: siteName,
      public: ".output/public",
      ignore: [
        "firebase.json",
        "**/.*",
        "**/node_modules/**",
        //
      ],
    };
    json.functions = {
      ...(json.functions || {}),
      codebase: siteName,
      runtime: `nodejs${nodeEngine}`,
    };
  });
}

function readJson(fileName: string) {
  try {
    const packageJson = fs.readFileSync(
      path.join(
        __dirname,
        fileName
        //
      ),
      "utf8"
      //
    );
    return JSON.parse(packageJson);
  } catch (e) {
    return {};
  }
}

function writeJson(fileName: string, json: any) {
  fs.writeFileSync(
    path.join(
      __dirname,
      fileName
      //
    ),
    JSON.stringify(json, null, 2),
    "utf8"
    //
  );
}

function editJson(fileName: string, edit: (json: any) => any) {
  const json = readJson(fileName);
  edit(json);
  writeJson(fileName, json);
  console.log(`Edited ${fileName}`);
}

main().catch(console.error);
