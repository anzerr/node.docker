FROM anzerr/node:9
RUN apk update && \
	apk upgrade && \
	apk --update add --no-cache --virtual .source-tools git build-base openssh-client findutils python

FROM alpine:3.9