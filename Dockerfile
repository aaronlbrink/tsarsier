# Start with debian and build things
FROM node:9.11.2-jessie as builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./packages/frontend ./front
RUN cd front/
RUN npm config set unsafe-perm
RUN npm install && npm run-script build

ADD deploy/serve.sh serve.sh

EXPOSE 3000/tcp

RUN ["npm", "install", "-g", "pm2"];

RUN ["chmod", "+x", "/usr/src/app/serve.sh"];
CMD ./serve.sh
