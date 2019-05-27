
const util = require('dockerfile.util'),
	mkdir = require('fs.mkdirp');

const ENUM = {BUILD: 0, FINAL: 1};

class Node extends require('../base.js') {

	constructor(version) {
		super();
		this.dockerfile.push(new util.Dockerfile());
		this.author = 'anzerr';
		this.version = `slim-${version}`;
		this.path = `docker/${version}/slim`;
		this.dockerName = 'Dockerfile';
		this.env = {
			VERSION: version
		};
	}

	build() {
		return super.build().then(() => {
			this.dockerfile[ENUM.BUILD]
				.from(`anzerr/node:${this.env.VERSION}`)
				.run([
					'apk add --no-cache binutils',
					'strip /usr/local/bin/node',
					'apk del binutils'
				]);
			this.dockerfile[ENUM.FINAL]
				.from('alpine:3.9')
				.copy('--from=0 /usr/local/bin/node /usr/local/bin/')
				.copy('--from=0 /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/')
				.cmd('["node"]');
		});
	}

	toFile() {
		return mkdir(this.path).then(() => {
			return super.toFile();
		});
	}

}

module.exports = Node;
