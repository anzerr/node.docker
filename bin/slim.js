
const util = require('dockerfile.util');

const ENUM = {BUILD: 0, FINAL: 1};

class Node extends util.Build {

	constructor(version) {
		super();
		this.dockerfile.push(new util.Dockerfile());
		this.author = 'anzerr';
		this.version = `slim-${version}`;
		this.dockerName = `Dockerfile.${this.version}`;
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

}

module.exports = Node;
