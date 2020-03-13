
const util = require('dockerfile.util'),
	mkdir = require('fs.mkdirp');

const ENUM = {BUILD: 0, FINAL: 1};

class Build extends require('../base.js') {

	constructor(version) {
		super();
		this.dockerfile.push(new util.Dockerfile());
		this.author = 'anzerr';
		this.version = `build-${version}`;
		this.path = `docker/${version}/build`;
		this.dockerName = 'Dockerfile';
		this.env = {
			VERSION: version
		};
	}

	build() {
		return super.build().then(() => {
			this.dockerfile[0]
				.from(`anzerr/node:${this.env.VERSION}`)
				.run([
					'apk update',
					'apk upgrade',
					'apk --update add --no-cache --virtual .source-tools git build-base openssh-client findutils python'
				]);
		});
	}

	toFile() {
		return mkdir(this.path).then(() => {
			return super.toFile();
		});
	}

}

module.exports = Build;
