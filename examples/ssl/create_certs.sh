#!/bin/bash

mkdir -p certs && \
cd certs && \
openssl req -x509 -newkey rsa:4096 -nodes -sha256 -subj '/CN=localhost' -days 3650 -keyout key.pem -out cert.pem
