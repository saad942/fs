# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/app

COPY ./nodejs/package*.json ./

RUN npm install

COPY ./nodejs .

EXPOSE 3001


CMD ["node", "index.js"]
