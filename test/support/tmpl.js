var fs = require('fs');

var variableRegExp = /\$([0-9a-zA-Z\.]+)/g;

module.exports = function renderFile(fileName, options, callback) {
  function onReadFile(err, str) {
    if (err) {
      callback(err);
      return;
    }

    try {
      str = str.replace(variableRegExp, generateVariableLookup(options));
    } catch (e) {
      err = e;
    }

    callback(err, str);
  }

  fs.readFile(fileName, 'utf8', onReadFile);
};

function generateVariableLookup(data) {
  return function variableLookup(str, path) {
    var parts = path.split('.');
    var value = data;

    for (var i = 0; i < parts.length; i++) {
      value = value[parts[i]];
    }

    return value;
  };
}
