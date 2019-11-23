#!/usr/bin/env node

const {Cli, Map} = require('cli.util'),
	Node = require('./images/node.js'),
	Slim = require('./images/slim.js'),
	fs = require('fs.promisify'),
	workflow = require('./workflow.js');

const builds = {
	'node:13': ['13.1.0', '1.19.1', Node, '13'],
	'node:12': ['12.13.0', '1.19.1', Node, '12'],
	'node:11': ['11.14.0', '1.19.1', Node, '11'],
	'node:10': ['10.17.0', '1.19.1', Node, '10'],
	'node:8': ['8.16.2', '1.19.1', Node, '8'],
	'node:6': ['6.17.1', '1.19.1', Node, '6'],
	'node:slim-13': ['13', null, Slim, '13'],
	'node:slim-12': ['12', null, Slim, '12'],
	'node:slim-11': ['11', null, Slim, '11'],
	'node:slim-10': ['10', null, Slim, '10'],
	'node:slim-8': ['8', null, Slim, '8'],
	'node:slim-6': ['6', null, Slim, '6']
};

let cli = new Cli(process.argv, [
	new Map('name')
		.alias(['n', 'N']).arg()
], 1);

console.log('.');
if (!cli.get('name')) {
	let wait = [];
	for (let i in builds) {
		((v) => {
			let a = new (v[2])(v[0], v[1]);
			wait.push(a.toFile().then(() => {
				return fs.writeFile(`.github/workflows/docker${v[3]}.yml`, workflow(v[3]));
			}));
		})(builds[i]);
	}
	Promise.all(wait).then(() => console.log('done'));
} else {
	let v = builds[cli.get('name') || ''];
	if (v) {
		new (v[2])(v[0], v[1]).run().then(() => {
			return fs.writeFile(`.github/workflows/docker${v[3]}.yml`, workflow(v[3]));
		}).then(() => {
			console.log('Server started');
		});
	} else {
		throw new Error('not a valid name given');
	}
}
