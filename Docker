FROM ubuntu:latest

RUN mkdir /root/test

WORKDIR /root/test

RUN git clone https://github.com/example/helloworld.git

WORKDIR /root/test/example/helloworld

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    curl \
    build-essential

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

RUN apt-get install -y nodejs

RUN npm init -y && \
    npm install express && \
    npm install body-parser

CMD ["node", "index.js"]
