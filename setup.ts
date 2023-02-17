// @ts-ignore
const fs = require("node:fs");
// @ts-ignore
const path = require("node:path");
// @ts-ignore
const readline = require("readline");

interface Input {
  question: string;
  example?: string;
  orDefault?: string;
}

async function readInput({
  question,
  example = "",
  orDefault = "",
}: Input): Promise<string> {
  return new Promise((resolve) => {
    const cli = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const prompt = [
      question?.trim(),
      example ? `(e.g. ${example})` : null,
      orDefault ? `(default: ${orDefault})` : null,
    ]
      .filter(Boolean)
      .join(" ");
    cli.question(prompt + ": ", (answer: string) => {
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
    {
      question: "Enter project ID",
      orDefault: path.basename(process.cwd()),
      //
    }
    //
  );
  const siteName = await readInput(
    {
      question: "Enter site name",
      example: "enter my-site for my-site.web.app",
      orDefault: projectId,
    }
    //
  );
  // const nodeEngine = "16";
  const nodeEngine = await readInput(
    {
      question: "Enter node engine version",
      example: "enter 16 for nodejs16",
      orDefault: "16",
    }
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
