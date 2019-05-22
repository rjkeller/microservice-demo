#!/bin/bash
########################
# Some helpful functions for running docker
########################
CUR_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ "$1" == "build" ]; then
  cd $CUR_DIR/demo-auth1 &&
    docker image build -t demo-auth1 --squash .
  cd $CUR_DIR/demo-rest1 &&
    docker image build -t demo-rest1 --squash .
  docker image prune -f
elif [ "$1" == "flush" ]; then
  docker stop $(docker ps -a -q)
  docker rm $(docker ps -a -q)
  docker rmi $(docker images -q)
elif [ "$1" == "load" ]; then
  docker load < images/demo-auth1.tar
  docker load < images/demo-rest1.tar
elif [ "$1" == "save" ]; then
  rm -rf images
  mkdir images
  docker image save demo-auth1:latest -o images/demo-auth1.tar
  docker image save demo-rest1:latest -o images/demo-rest1.tar
elif [ "$1" == "up" ]; then
  if [ "$2" == "--dev" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.debug.yml up
  else
    docker-compose up
  fi
fi
