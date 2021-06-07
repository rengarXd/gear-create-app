const { join } = require("path");

exports.CWD = process.cwd() + '/dist';
exports.GENERATOR_DIR = join(__dirname, "../generators");
