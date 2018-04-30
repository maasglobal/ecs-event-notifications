#!/usr/bin/env bash

cd "${0%/*}"

docker build . -t example-image:latest

function testExitCode {
  if [ $1 -ne $2 ]; then
    echo Exit code should be $2, but got $1
    exit 1
  else
    echo 'Ok'
  fi
}

docker run -e EXIT_CODE=0 -t example-image:latest /bin/sh
testExitCode $? 0

docker run -e EXIT_CODE=1 -t example-image:latest /bin/sh
testExitCode $? 1
