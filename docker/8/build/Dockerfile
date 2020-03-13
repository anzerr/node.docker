FROM anzerr/node:8
RUN apk update && \
	apk upgrade && \
	apk --update add --no-cache --virtual .source-tools git build-base openssh-client findutils python
ENTRYPOINT ["node"]