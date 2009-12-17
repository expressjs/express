/* Ejs template parser for CommonJS
 *
 * Copyright (c) 2009, Howard Rauscher
 * Licensed under the MIT License
 *
 * base on:
 * Simple JavaScript Templating (http://ejohn.org/blog/javascript-micro-templating/)
 * John Resig - http://ejohn.org/ - MIT Licensed
 */
 
(function(){
    var cache = {};
 
    var ejs = this.ejs = {};
 
    ejs.parse = function tmpl(str, options) {
        options = options || {};
        options.context = options.context || {};
        options.locals = options.locals || {};
 
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = cache[str] ||
 
        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj",
            "var p=[];" +
 
            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
 
            // Convert the template into pure JavaScript
            str
                .replace(/\-%>(\n|\r)/g, "%>")
                .replace(/[\t\b\f]/g, " ")
                .replace(/[\n\r]/g, "\f")
                .split("<%").join("\t")
                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t").join("');")
                .split("%>").join("p.push('")
                .split("\r").join("\\'").replace(/\f+/g, '\\n') +
            "');}return p.join('');");
 
        cache[str] = fn;
 
        // Provide some basic currying to the user
        return fn.call(options.context, options.locals);
    };
})();
 
exports.render = ejs.parse;