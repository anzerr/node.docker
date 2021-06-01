#!/usr/bin/env node

const {Cli, Map} = require('cli.util'),
	Node = require('./images/node.js'),
	Slim = require('./images/slim.js'),
	Build = require('./images/build.js'),
	Request = require('request.libary'),
	fs = require('fs.promisify'),
	workflow = require('./workflow.js');

let cli = new Cli(process.argv, [
	new Map('name')
		.alias(['n', 'N']).arg()
], 1);

console.log('.');
if (!cli.get('name')) {
	new Request('https://nodejs.org').get('/dist/index.json').then((res) => {
		if (res.isOkay()) {
			let body = res.parse();
			if (!Buffer.isBuffer(body)) {
				return body;
			}
		}
		throw new Error('failed request');
	}).then((versions) => {
		const map = {};
		for (let i in versions) {
			let v = versions[i].version.replace('v', '').split('.').map((a) => Number(a));
			if (v[0] >= 6) {
				if (map[v[0]]) {
					const m = map[v[0]];
					for (let x in v) {
						if (m[x] < v[x]) {
							map[v[0]] = v;
							break;
						}
						if (m[x] !== v[x]) {
							break;
						}
					}
				} else {
					map[v[0]] = v;
				}
			}
		}
		return map;
	}).then((res) => {
		let wait = [];
		for (let i in res) {
			((key, v) => {
				wait.push(Promise.all([
					new Node(v, '1.19.1', (key === '16') ? '3' : null).toFile(),
					new Build(key).toFile(),
					new Slim(key).toFile(),
					fs.writeFile(`.github/workflows/docker${key}.yml`, workflow(key))
				]));
			})(i, res[i].join('.'));
		}
		Promise.all(wait).then(() => console.log('done'));
	}).catch((err) => {
		console.log(err);
	});
}
