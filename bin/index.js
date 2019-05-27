#!/usr/bin/env node

const {Cli, Map} = require('cli.util'),
	Node = require('./images/node.js'),
	Slim = require('./images/slim.js');

const builds = {
	'node:12': ['12.3.1', '1.16.0', Node],
	'node:11': ['11.14.0', '1.15.2', Node],
	'node:10': ['10.15.3', '1.13.0', Node],
	'node:6': ['6.17.1', '1.15.2', Node],
	'node:slim-12': ['12', null, Slim],
	'node:slim-11': ['11', null, Slim],
	'node:slim-10': ['10', null, Slim],
	'node:slim-6': ['6', null, Slim]
};

let cli = new Cli(process.argv, [
	new Map('name')
		.alias(['n', 'N']).arg()
], 1);

if (!cli.get('name')) {
	let wait = [];
	for (let i in builds) {
		((v) => {
			let a = new (v[2])(v[0], v[1]);
			wait.push(a.toFile());
		})(builds[i]);
	}
	Promise.all(wait).then(() => console.log('done'));
} else {
	let v = builds[cli.get('name') || ''];
	if (v) {
		new (v[2])(v[0], v[1]).run().then(() => {
			console.log('Server started');
		});
	} else {
		throw new Error('not a valid name given');
	}
}
