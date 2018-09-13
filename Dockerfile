FROM node:10.10.0-alpine
# File Author / Maintainer
MAINTAINER Jordon Kopp (koppj)

# Add bash since Alpine is barebones
RUN apk update
RUN apk upgrade
RUN apk add bash

# Add dir for code
RUN mkdir /code
WORKDIR /code

# Add Source Code
ADD . /code

RUN touch /code/app/loggeraccess.log
RUN touch /code/app/loggererrors.log

# Symlink to stdout/err
RUN ln -sf /dev/stdout /code/app/loggeraccess.log && ln -sf /dev/stderr /code/app/loggererrors.log

# Install dependencies
RUN npm install

RUN chmod +x entrypoint.sh

ENTRYPOINT ["/code/entrypoint.sh"]