FROM alpine:3.9
RUN addgroup -g 1000 node && \
	adduser -u 1000 -G node -s /bin/sh -D node && \
	apk add --update --no-cache libstdc++ && \
	apk add --no-cache --virtual .build-deps binutils-gold curl g++ gcc gnupg libgcc linux-headers make python && \
	for key in 						4ED778F539E3634C779C87C6D7062848A1AB005C 						94AE36675C464D64BAFA68DD7434390BDBE9B9C5 						74F12602B6F1C4E913FAA37AD3A89613643B6201 						71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 						8FCCA13FEF1D0C2E91008E09770F7A9A5AE15600 						C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 						C82FA3AE1CBEDC6BE46B9360C43CEC45C17AB93C 						DD8F2338BAE7501E3DD5AC78C273792F7D83545D 						A48C2BEE680E841632CD4E44F07496B3EB3C1762 						108F52B48DB57BB0CC439B2997B01419BD92F80A 						B9E2F5981AA6E0CD28160D9FF13993A75599653C 						B9AE9905FFD7803F25714661B63B535A4C206CA9 					; do 						gpg --batch --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys "$key" || 						gpg --batch --keyserver hkp://ipv4.pool.sks-keyservers.net --recv-keys "$key" || 						gpg --batch --keyserver hkp://pgp.mit.edu:80 --recv-keys "$key" ; 					done && \
	curl -fsSLO --compressed "https://nodejs.org/dist/v9.11.2/node-v9.11.2.tar.xz" && \
	curl -fsSLO --compressed "https://nodejs.org/dist/v9.11.2/SHASUMS256.txt.asc" && \
	gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc && \
	grep " node-v9.11.2.tar.xz$" SHASUMS256.txt | sha256sum -c - && \
	tar -xf "node-v9.11.2.tar.xz" && \
	cd "node-v9.11.2" && \
	./configure && \
	make -j$(getconf _NPROCESSORS_ONLN) V= && \
	echo "make build done" && \
	make install && \
	echo "make install done" && \
	apk del .build-deps && \
	echo "apk del done" && \
	cd .. && \
	rm -Rf "node-v9.11.2" && \
	rm "node-v9.11.2.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt
RUN echo "start install yarm" && \
	apk add --no-cache --virtual .build-deps-yarn curl gnupg tar && \
	for key in 						6A010C5166006599AA17F08146C2130DFD2497F5 					; do 						gpg --batch --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys "$key" || 						gpg --batch --keyserver hkp://ipv4.pool.sks-keyservers.net --recv-keys "$key" || 						gpg --batch --keyserver hkp://pgp.mit.edu:80 --recv-keys "$key" ; 					done && \
	curl -fsSLO --compressed "https://yarnpkg.com/downloads/1.19.1/yarn-v1.19.1.tar.gz" && \
	curl -fsSLO --compressed "https://yarnpkg.com/downloads/1.19.1/yarn-v1.19.1.tar.gz.asc" && \
	gpg --batch --verify yarn-v1.19.1.tar.gz.asc yarn-v1.19.1.tar.gz && \
	mkdir -p /opt && \
	tar -xzf yarn-v1.19.1.tar.gz -C /opt/ && \
	ln -s /opt/yarn-v1.19.1/bin/yarn /usr/local/bin/yarn && \
	ln -s /opt/yarn-v1.19.1/bin/yarnpkg /usr/local/bin/yarnpkg && \
	rm yarn-v1.19.1.tar.gz.asc yarn-v1.19.1.tar.gz && \
	apk del .build-deps-yarn
ENTRYPOINT ["node"]