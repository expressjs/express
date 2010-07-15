#!/usr/bin/env node

var fs = require('fs'),
    file = process.argv[2];

if (file) {
    var js = fs.readFileSync(file, 'utf8'),
        headers = js.match(/<h3 id="(.*?)">(.*?)<\/h3>/g),
        toc = ['<ul id="toc">'];
    if (js.indexOf('id="toc"') < 0) {
        headers.forEach(function(header){
            var captures = header.match(/id="(.*?)">(.*?)</),
                id = captures[1],
                title = captures[2].replace(/\(.*?\)/, '()');
            toc.push('<li><a href="#' + id + '">' + title + '</a></li>');
        });
        toc.push('</ul>');
        js = js.replace('<div id="container">', '<div id="container">' + toc.join('\n'));
        fs.writeFileSync(file, js);
    }
}