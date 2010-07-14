mkdir /tmp/express \
  && cd /tmp/express \
  && curl -# -L http://github.com/visionmedia/express/tarball/master \
  | tar xz --strip 1 \
  && cp -f bin/express /usr/local/bin/express \
  && cp -fr lib/express ~/.node_libraries/express \
  && echo "Installation complete"