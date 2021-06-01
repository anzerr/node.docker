FROM anzerr/node:16
RUN apk add --no-cache binutils && \
	strip /usr/local/bin/node && \
	apk del binutils

FROM alpine:3.9
COPY --from=0 /usr/local/bin/node /usr/local/bin/
COPY --from=0 /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/
ENTRYPOINT ["node"]