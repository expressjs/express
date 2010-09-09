
install() {
    mkdir -p /tmp/$2 \
        && cd /tmp/$2 \
        && echo "... installing $2" \
        && curl -# -L "http://github.com/$1/$2/tarball/master" \
            | tar xz --strip 1 \
        && mkdir -p ~/.node_libraries \
        && cp -fr lib/$2 ~/.node_libraries/$2
}

install visionmedia express \
    && install senchalabs connect \
    && cp -f /tmp/express/bin/express /usr/local/bin/express \
    && echo "... installation complete"