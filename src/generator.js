const Generator = require("yeoman-generator");
const Yeoman = require("yeoman-environment");
const { GENERATOR_DIR, CWD } = require("./constant");
const { join } = require("path");
const chalk = require("chalk");
const glob = require("fast-glob");
const consola = require("consola");
const fs = require("fs");

const PROJECT_NAME = "vueVersion";

module.exports = class extends Generator {
  inputs = {
    name: "",
    cssLang: "",
    vueVersion: "",
    preprocessor: "",
  };
  PROMPTS = [
    {
      name: "vueVersion",
      message: "请选择一个项目",
      type: "list",
      choices: [],
    },
  ];
  constructor(name) {
    super([], {
      env: Yeoman.createEnv([], {
        cwd: join(CWD, name),
      }),
      resolved: GENERATOR_DIR,
      skipInstall: true,
    });

    this.inputs.name = name;

    this.ensureFile(this.PROMPTS);
  }

  ensureFile(param) {
    if (!param) return
    const files = fs.readdirSync(GENERATOR_DIR);
    param.forEach((item) => {
      if (item.name === PROJECT_NAME) {
        item.choices = files;
      }
    });
  }

  async prompting() {
    return this.prompt(this.PROMPTS).then((inputs) => {
      this.inputs.vueVersion = inputs.vueVersion;
    });
  }

  writing() {
    consola.info(`Creating project in ${join(CWD, this.inputs.name)}\n`);
    /**
    @see {@link https://github.com/mrmlnc/fast-glob#how-to-write-patterns-on-windows}
    */
    const templatePath = join(GENERATOR_DIR, this.inputs.vueVersion).replace(
      /\\/g,
      "/"
    );
    const templateFiles = glob.sync(
      join(templatePath, "**", "*").replace(/\\/g, "/"),
      {
        dot: true,
      }
    );
    const destinationRoot = this.destinationRoot();

    templateFiles.forEach((filePath) => {
      const outputPath = filePath
        .replace(".tpl", "")
        .replace(templatePath, destinationRoot);
      this.fs.copyTpl(filePath, outputPath, this.inputs);
    });
  }

  install() {
    console.log();
    consola.info("Install dependencies...\n");

    process.chdir(this.inputs.name);

    // this.installDependencies({
    //   npm: false,
    //   bower: false,
    //   yarn: false,
    //   skipMessage: true,
    //   skipInstall: true,
    // });
  }

  end() {
    const { name } = this.inputs;

    console.log();
    consola.success(`Successfully created ${chalk.yellow(name)}.`);
    consola.success(
      `Run ${chalk.yellow(`cd ${name} && yarn dev`)} to start development!`
    );
  }
};
