#!/usr/bin/env sh

# if exit code is not set use 0
if [ -z ${EXIT_CODE+x} ]; then EXIT_CODE=0; fi

echo "Running container with exit code ${EXIT_CODE}"

exit $EXIT_CODE
