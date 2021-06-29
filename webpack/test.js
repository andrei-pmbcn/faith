const { merge } = require("webpack-merge");
const path = require("path");
const base = require("./base.js");
const exec = require('child_process').exec;

const postBuildPlugin = {
	apply: (compiler) => {
		compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
			exec('mocha dist/testBundle.js', (err, stdout, stderr) => {
				if (stdout) process.stdout.write(stdout);
				if (stderr) process.stderr.write(stderr);
			});
		});
	},
};

module.exports = merge(base, {
  entry: path.join(__dirname, '../test/all.js'),
  output: {
    filename: 'testBundle.js',
    path: path.join(__dirname, '../dist'),
  },
	plugins: [
		postBuildPlugin,
	]
});
