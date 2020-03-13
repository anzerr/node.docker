FROM anzerr/node:7
RUN apk update && \
	apk upgrade && \
	apk --update add --no-cache --virtual .source-tools git build-base openssh-client findutils python

FROM alpine:3.9