#!/bin/bash
export NODE_ENV="development"
export LOG_LEVEL="debug"

npm run start
"$@"
