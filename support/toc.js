#!/usr/bin/env node

var fs = require('fs'),
    file = process.argv[2];

if (file) {
    var html = fs.readFileSync(file, 'utf8')
      , toc = ['<ul id="toc">']
      , sections = {};

    html = html.replace(/<h3>(.*?)<\/h3>/g, function(_, title){
      var id = title.toLowerCase().replace(' ', '-').replace(/\(.*?\)/, '()');
      if (~title.indexOf('.')) {
        var parts = title.split('.')
          , recv = parts.shift()
          , method = parts.shift().replace(/\(.*?\)/, '()');
        if (recv == 'app') recv = 'Server';
        if (recv == 'req') recv = 'Request';
        if (recv == 'res') recv = 'Response';
        sections[recv] = sections[recv] || [];
        sections[recv].push('<li><a href="#' + id + '">' + method + '</a></li>');
      } else {
        toc.push('<li><a href="#' + id + '">' + title + '</a></li>');
      }
      return '<h3 id="' + id + '">' + title + '</h3>';
    });

    toc.push(renderSections());
    toc.push('</ul>');
    html = html.replace('<div id="container">', '<div id="container">' + toc.join('\n'));
    fs.writeFileSync(file, html);
}

function renderSections() {
  var buf = [];
  Object.keys(sections).forEach(function(section){
    var methods = sections[section],
        a = '<a href="#" class="toggle">+</a> <a class="section-title" href="#">' + section + '</a>';
    buf.push('<li>' + a + '<ul class="section" id="section-' + section + '">');
    buf.push(methods.join('\n'));
    buf.push('</ul></li>');
  });
  return buf.join('\n');
}