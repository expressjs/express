
/**
 * Compiled template cache.
 */

var cache = {}

exports.render = function(str, options) {
  options = options || {}
  var fn = cache[str] = cache[str] ||
    new Function("locals",
      "var p=[],print=function(){p.push.apply(p,arguments);};" +
      "with(locals){p.push('" +
      str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .split("'").join("\\'")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'")
    + "');}return p.join('');")
  return fn.call(options.context, options.locals || {})
}

