FROM ubuntu:latest

RUN apt-get update && apt-get install -y git curl && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs

WORKDIR /usr/src/app


RUN git clone https://github.com/Abdul8057/express.git

RUN ls -lrth

WORKDIR /usr/src/app/express/examples/hello-world/

RUN ls -lrth

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
