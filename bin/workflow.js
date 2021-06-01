
module.exports = (version) => {
	return `
name: docker${version}

on:
  push:
    branches:
      - master
    paths:
      - docker/${version}/**

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: anzerr/docker.action@master
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_PASSWORD }}
          registry: docker.pkg.github.com
          args: |
            cd docker/${version}
            docker build -t docker.pkg.github.com/anzerr/node.docker/node.docker:${version} . &&
            docker push docker.pkg.github.com/anzerr/node.docker/node.docker:${version}
      - uses: anzerr/docker.action@master
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_HUB_PASSWORD }}
          args: |
            cd docker/${version}
            docker build -t anzerr/node:${version} . &&
            docker push anzerr/node:${version}
      - uses: anzerr/docker.action@master
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_PASSWORD }}
          registry: docker.pkg.github.com
          args: |
            cd docker/${version}/build
            docker build -t docker.pkg.github.com/anzerr/node.docker/node.docker:build-${version} . &&
            docker push docker.pkg.github.com/anzerr/node.docker/node.docker:build-${version}
      - uses: anzerr/docker.action@master
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_HUB_PASSWORD }}
          args: |
            cd docker/${version}/build
            docker build -t anzerr/node:build-${version} . &&
            docker push anzerr/node:build-${version}
      - uses: anzerr/docker.action@master
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_PASSWORD }}
          registry: docker.pkg.github.com
          args: |
            cd docker/${version}/slim
            docker build -t docker.pkg.github.com/anzerr/node.docker/node.docker:slim-${version} . &&
            docker push docker.pkg.github.com/anzerr/node.docker/node.docker:slim-${version}
      - uses: anzerr/docker.action@master
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_HUB_PASSWORD }}
          args: |
            cd docker/${version}/slim
            docker build -t anzerr/node:slim-${version} . &&
            docker push anzerr/node:slim-${version}`;
};
