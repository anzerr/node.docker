
const mkdir = require('fs.mkdirp');

class Node extends require('../base.js') {

	constructor(node, yarn, python) {
		super();
		this.author = 'anzerr';
		this.version = node.match(/^(\d+)\./)[1];
		this.path = `docker/${this.version}`;
		this.dockerName = 'Dockerfile';
		this.env = {
			NODE_VERSION: node,
			YARN_VERSION: yarn
		};
		this.python = python;
	}

	build() {
		return super.build().then(() => {
			this.dockerfile[0]
				.run([
					'addgroup -g 1000 node',
					'adduser -u 1000 -G node -s /bin/sh -D node',
					'apk add --update --no-cache libstdc++',
					'apk add --no-cache --virtual .build-deps ' + [
						'binutils-gold',
						'curl',
						'g++',
						'gcc',
						'gnupg',
						'libgcc',
						'linux-headers',
						'make',
						this.python === '3'? 'python3' : 'python'
					].join(' '),
					/*eslint-disable */
					`for key in \
						4ED778F539E3634C779C87C6D7062848A1AB005C \
						94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
						74F12602B6F1C4E913FAA37AD3A89613643B6201 \
						71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
						8FCCA13FEF1D0C2E91008E09770F7A9A5AE15600 \
						C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
						C82FA3AE1CBEDC6BE46B9360C43CEC45C17AB93C \
						DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
						A48C2BEE680E841632CD4E44F07496B3EB3C1762 \
						108F52B48DB57BB0CC439B2997B01419BD92F80A \
						B9E2F5981AA6E0CD28160D9FF13993A75599653C \
						B9AE9905FFD7803F25714661B63B535A4C206CA9 \
					; do \
						gpg --batch --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys "$key" || \
						gpg --batch --keyserver hkp://ipv4.pool.sks-keyservers.net --recv-keys "$key" || \
						gpg --batch --keyserver hkp://pgp.mit.edu:80 --recv-keys "$key" ; \
					done`,
					/* eslint-enable */
					`curl -fsSLO --compressed "https://nodejs.org/dist/v${this.env.NODE_VERSION}/node-v${this.env.NODE_VERSION}.tar.xz"`,
					`curl -fsSLO --compressed "https://nodejs.org/dist/v${this.env.NODE_VERSION}/SHASUMS256.txt.asc"`,
					'gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc',
					`grep " node-v${this.env.NODE_VERSION}.tar.xz\$" SHASUMS256.txt | sha256sum -c -`,
					`tar -xf "node-v${this.env.NODE_VERSION}.tar.xz"`,
					`cd "node-v${this.env.NODE_VERSION}"`,
					'./configure',
					'make -j$(getconf _NPROCESSORS_ONLN) V=',
					'echo "make build done"',
					'make install',
					'echo "make install done"',
					'apk del .build-deps',
					'echo "apk del done"',
					'cd ..',
					`rm -Rf "node-v${this.env.NODE_VERSION}"`,
					`rm "node-v${this.env.NODE_VERSION}.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt`
				])
				.run([
					'echo "start install yarm"',
					'apk add --no-cache --virtual .build-deps-yarn curl gnupg tar',
					/*eslint-disable */
					`for key in \
						6A010C5166006599AA17F08146C2130DFD2497F5 \
					; do \
						gpg --batch --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys "$key" || \
						gpg --batch --keyserver hkp://ipv4.pool.sks-keyservers.net --recv-keys "$key" || \
						gpg --batch --keyserver hkp://pgp.mit.edu:80 --recv-keys "$key" ; \
					done`,
					/* eslint-enable */
					`curl -fsSLO --compressed "https://yarnpkg.com/downloads/${this.env.YARN_VERSION}/yarn-v${this.env.YARN_VERSION}.tar.gz"`,
					`curl -fsSLO --compressed "https://yarnpkg.com/downloads/${this.env.YARN_VERSION}/yarn-v${this.env.YARN_VERSION}.tar.gz.asc"`,
					`gpg --batch --verify yarn-v${this.env.YARN_VERSION}.tar.gz.asc yarn-v${this.env.YARN_VERSION}.tar.gz`,
					'mkdir -p /opt',
					`tar -xzf yarn-v${this.env.YARN_VERSION}.tar.gz -C /opt/`,
					`ln -s /opt/yarn-v${this.env.YARN_VERSION}/bin/yarn /usr/local/bin/yarn`,
					`ln -s /opt/yarn-v${this.env.YARN_VERSION}/bin/yarnpkg /usr/local/bin/yarnpkg`,
					`rm yarn-v${this.env.YARN_VERSION}.tar.gz.asc yarn-v${this.env.YARN_VERSION}.tar.gz`,
					'apk del .build-deps-yarn'
				])
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
