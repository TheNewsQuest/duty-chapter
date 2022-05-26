FROM node:14
LABEL maintainer "minhlucky2408@gmail.com"


# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#Install app dependencies
COPY package*.json .
RUN npm install


# Bundle app source (including env file)
COPY . .
COPY .env.production .env

EXPOSE 4000
CMD [ "npm", "start" ]