FROM node
COPY .  .
RUN npm install
RUN npm version
CMD node express/examples/hello-world/index.js
EXPOSE 3000
