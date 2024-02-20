# React Application Dockerfile
FROM node:14 as build

WORKDIR /app

COPY ./react/package*.json ./
RUN npm install

COPY ./react .



EXPOSE 3000

CMD ["npm", "start"]
