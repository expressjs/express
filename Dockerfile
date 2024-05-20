FROM node:14
WORKDIR /usr/src/app
COPY package.json package.json
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node","index.js"]
