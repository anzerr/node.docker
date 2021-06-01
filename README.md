
### `Intro`
![GitHub Actions status | linter](https://github.com/anzerr/node.docker/workflows/docker6/badge.svg)
![GitHub Actions status | linter](https://github.com/anzerr/node.docker/workflows/docker7/badge.svg)
![GitHub Actions status | linter](https://github.com/anzerr/node.docker/workflows/docker8/badge.svg)
![GitHub Actions status | linter](https://github.com/anzerr/node.docker/workflows/docker9/badge.svg)
![GitHub Actions status | linter](https://github.com/anzerr/node.docker/workflows/docker10/badge.svg)
![GitHub Actions status | linter](https://github.com/anzerr/node.docker/workflows/docker11/badge.svg)
![GitHub Actions status | linter](https://github.com/anzerr/node.docker/workflows/docker12/badge.svg)
![GitHub Actions status | linter](https://github.com/anzerr/node.docker/workflows/docker13/badge.svg)
![GitHub Actions status | linter](https://github.com/anzerr/node.docker/workflows/docker14/badge.svg)
![GitHub Actions status | linter](https://github.com/anzerr/node.docker/workflows/docker15/badge.svg)
![GitHub Actions status | linter](https://github.com/anzerr/node.docker/workflows/docker16/badge.svg)

Docker images for NodeJs with npm and yarm and a slim version without

npm and yarm take up around 40% of the base image. They are not needed in a final version. This is useful on multi layer docker files.

#### `Example`
you can build/install all your dependencies then copy the end source to a clean layer
``` Dockerfile
FROM anzerr/node:11
COPY . /app
RUN cd /app && \
	apk upgrade && apk --update add --no-cache --virtual .source-tools git build-base openssh-client findutils && \
	npm install --only=prod
	find /app -regextype egrep -regex ".*\.(ts|map|md|Dockerfile|LICENSE)$"  -type f -delete

FROM anzerr/node:slim-11
COPY COPY --from=0 /app /app
CMD ["node"]
```