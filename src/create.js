// const path = require("path");
const inquirer = require("inquirer");
const { ensureDir } = require("fs-extra");
const XdGenerator = require("./generator.js");
const consola = require('consola')

async function create(projectName, options) {
  if (options.proxy) {
    process.env.HTTP_PROXY = options.proxy;
  }
  const promptList = [
    {
      type: "input",
      message: "设置一个项目名:",
      name: "name",
      default: "test_user", // 默认值
    },
  ];
  console.log(`请为您的项目,${projectName},添加配置`);
  const { name } = await inquirer.prompt(promptList);
  try {
    await ensureDir('dist/'+name);
    consola.log(process.cwd())
    const generator = new XdGenerator(name);
    generator.run();
  } catch (e) {
    consola.error(e);
  }
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    process.exit(1);
  });
};
