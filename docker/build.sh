#!/bin/bash

if [[ ${1} == "help" || "$#" -lt 2 ]]; then
    echo "Usage: sh ${0} APP VER"
    echo "APP        APP of docker image"
    echo "              ex. api, web, docs"
    echo "VER           Version of docker image"
    echo "              ex. 1.0.0, 1.1.0, ..."
    exit;
fi

APP=${1}
VER=${2}
IMAGE="user-feedback/${APP}"
TAG="${IMAGE}:${VER}"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DOCKER_DIR="$( cd "${DIR}" >/dev/null 2>&1 && pwd )"
APP_DIR="$( cd "${DIR}/../" >/dev/null 2>&1 && pwd )"

DOCKER_FILE=${DOCKER_DIR}/${1}.dockerfile

echo ""
echo "DOCKER_FILE:${DOCKER_FILE}"
echo "TAG:${TAG}"
echo ""
echo "docker image build start - ${TAG}"

docker build -t ${TAG} -f ${DOCKER_FILE} ${APP_DIR}

if [[ $? -ne 0 ]]; then
    echo "docker image build failed - ${TAG}"
    exit -1;
fi

echo "docker image build done - ${TAG}"
