/* ex:ts=2:et: */
/*jslint bitwise: true, browser: true, eqeqeq: true, evil: true, immed: true, newcap: true,
    nomen: true, plusplus: true, regexp: true, undef: true, white: true, indent: 2 */
/*globals */
 
function Haml() {}
 
Haml.to_html = function (json) {
 
  if (typeof json === 'string') {
 
    if (json.substr(0, 3) === '!!!') {
      switch (json.substr(4).toLowerCase()) {
        case 'xml':
          return "<?xml version='1.0' encoding='utf-8' ?>\n";
        case '':
          return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n';
        case '1.1':
          return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n';
        case 'strict':
          return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n';
      }
    }
    return json;
  }
  if (typeof json === 'object' && json.length !== undefined) {
    if (typeof json[0] === 'object')
    {
      if (json[0].tag !== undefined) {
        return (function () {
          var tag, element, html, attributes;
          element = json.shift();
          tag = element.tag;
          html = tag;
          for (var key in element) {
            if (element.hasOwnProperty(key) && key !== 'tag') {
              html += " " + key + "=\"" + element[key].
                replace("&", "&amp;").
                replace("<", "&lt;").
                replace(">", "&gt;").
                replace("\"", "&quot;") + "\"";
            }
          }
          if (json.length === 0 && (tag === "link" || tag === 'br' || tag === 'input')) {
            return "\n<" + html + " />\n";
          }
          return "\n<" + html + ">" + Haml.to_html(json) + "</" + tag + ">\n";
        }());
      }
      if (json[0].plugin !== undefined) {
          switch (json.shift().plugin) {
            case "javascript":
              return '\n<script type="text/javascript">\n//<![CDATA[\n  ' + json[0].split("\n").join("\n  ") + "\n//]]>\n</script>\n";
            case "css":
              return '\n<style type="text/css">\n  ' + json[0].split("\n").join("\n  ") + "\n</style>\n";
          }
      }
    }
    return json.map(Haml.to_html).join('');
  }
  return JSON.stringify(json);
}
 
Haml.parse = function (text) {
 
  var empty_regex = new RegExp("^[ \t]*$"),
      indent_regex = new RegExp("^ *"),
      element_regex = new RegExp("^(?::[a-z]+|(?:[%][a-z][a-z0-9]*)?(?:[#.][a-z0-9_-]+)*)", "i"),
      scope = this,
      haml, element, stack, indent, buffer, old_indent, mode, last_insert;
 
  // Sortof an instance_eval for Javascript
  function instance_eval(input) {
    var block;
    block = function () { with(scope) { return eval("(" + input + ")"); } };
    return block.call(scope);
  }
 
  function process_embedded_code(string) {
    if (typeof string !== 'string') {
      return string;
    }
    var matches = string.match(/#{([^}]*)}/g);
    if (matches) {
      matches.forEach(function (match) {
        var pair = match.match(/#{([^}]*)}/);
        string = string.replace(pair[0], instance_eval(pair[1]));
      })
    }
    return string;
  }
 
  function flush_buffer() {
    if (buffer.length > 0) {
      mode = "NORMAL";
      element.push(process_embedded_code(buffer.join("\n")));
      buffer = [];
    }
  }
 
  function parse_push() {
    stack.push({element: element, mode: mode});
    var new_element = [];
    mode = "NORMAL";
    element.push(new_element);
    element = new_element;
  }
 
  function parse_pop() {
    var last = stack.pop();
 
    if (element.length === 1) {
      if (typeof element[0] === "string") {
        if (element[0].match(element_regex)[0].length === 0) {
          // Collapse arrays with single string literal
          last.element[last.element.length - 1] = element[0];
        }
      }
    }
    element = last.element;
    mode = last.mode;
  }
 
  function get_indent(line) {
    if (line === undefined) {
      return 0;
    }
    var i = line.match(indent_regex);
    return i[0].length / 2;
  }
 
  function parse_attribs(line) {
    // Parse the attribute block using a state machine
    if (!(line.length > 0 && line.charAt(0) === '{')) {
      return line;
    }
    var l = line.length;
    var count = 1;
    var quote = false;
    var skip = false;
    for (var i = 1; count > 0; i += 1) {
 
      // If we reach the end of the line, then there is a problem
      if (i > l) {
        throw "Malformed attribute block";
      }
 
      var c = line.charAt(i);
      if (skip) {
        skip = false;
      } else {
        if (quote) {
          if (c === '\\') {
            skip = true;
          }
          if (c === quote) {
            quote = false;
          }
        } else {
          if (c === '"' || c === "'") {
            quote = c;
          }
          if (c === '{') {
            count += 1;
          }
          if (c === '}') {
            count -= 1;
          }
        }
      }
    }
    var block = line.substr(0, i);
    (function () {
      element.push(instance_eval(block))
    }.call(this));
    return line.substr(i);
  }
 
  function parse_content(line) {
    // Strip off leading whitespace
    line = line.replace(indent_regex, '');
 
    // Ignore blank lines
    if (line.length === 0) {
      return;
    }
 
    if (mode === 'ELEMENT') {
      parse_pop();
    }
 
    switch (line.charAt(0)) {
    case '/':
      break;
    case '=':
      (function () {
        buffer.push(instance_eval(line.substr(1)));
      }.call(this));
      break;
    case "\\":
      buffer.push(line.substr(1));
      break;
    default:
      buffer.push(line);
      break;
    }
  }
 
  function parse_element(line, selector) {
 
    flush_buffer();
    if (element.length > 0) {
      if (mode === 'ELEMENT') {
        parse_pop();
      }
      parse_push();
    }
    mode = 'ELEMENT';
 
    var classes = selector.match(/\.[^\.#]+/g),
    ids = selector.match(/#[^\.#]+/g),
    tag = selector.match(/^%([^\.#]+)/g),
    plugin = selector.match(/^:([^\.#]+)/g);
    tag = tag ? tag[0].substr(1) : (plugin ? null : 'div');
    plugin = plugin ? plugin[0].substr(1) : null;
 
    line = parse_attribs.call(this, line.substr(selector.length));
 
    var attrs;
    if (typeof element[element.length - 1] === "object") {
      attrs = element[element.length - 1];
    } else {
      attrs = {};
      element.push(attrs);
    }
    if (tag) {
      attrs.tag = tag;
    }
    if (plugin) {
      attrs.plugin = plugin;
    }
    if (ids) {
      for (var i = 0, l = ids.length; i < l; i += 1) {
        ids[i] = ids[i].substr(1);
      }
      if (attrs.id) {
        ids.push(attrs.id);
      }
      attrs.id = ids.join(" ");
    }
    if (classes) {
      for (var i = 0, l = classes.length; i < l; i += 1) {
        classes[i] = classes[i].substr(1);
      }
      if (attrs['class']) {
        classes.push(attrs['class']);
      }
      attrs['class'] = classes.join(" ");
    }
 
    if (selector.charAt(0) === ':') {
      mode = 'RAW';
    } else {
      if (!line.match(empty_regex)) {
        parse_push();
        parse_content.call(this, line, true);
        flush_buffer();
        parse_pop();
      }
    }
  }
 
  function process_plugins() {
    var contents, i;
    switch (element[0].plugin) {
    case 'if':
      var condition = element[0].condition;
      contents = element[1];
      for (i in element) {
        if (element.hasOwnProperty(i)) {
          delete element[i];
        }
      }
      if (condition) {
        var new_element = Haml.parse.call(this, contents);
        for (i in new_element) {
          if (new_element.hasOwnProperty(i)) {
            element[i] = new_element[i];
          }
        }
        element.length = new_element.length;
      }
      break;
    case 'foreach':
      var array, key, value, key_name, value_name;
      array = element[0].array;
      key_name = element[0].key;
      value_name = element[0].value;
      contents = element[1];
      for (i in element) {
        if (element.hasOwnProperty(i)) {
          delete element[i];
        }
      }
      element.length = 0;
      for (key in array) {
        if (array.hasOwnProperty(key)) {
          value = array[key];
          this[key_name] = key;
          this[value_name] = value;
          element.push(Haml.parse.call(this, contents));
        }
      }
      break;
    }
  }
 
  haml = [];
  element = haml;
  stack = [];
  buffer = [];
  mode = 'NORMAL';
  parse_push(); // Prime the pump so we can have multiple root elements
  indent = 0;
  old_indent = indent;
 
  var lines = text.split("\n"),
      line, line_index, line_count;
 
  line_count = lines.length;
  for (line_index = 0; line_index <= line_count; line_index += 1) {
    line = lines[line_index];
 
    switch (mode) {
    case 'ELEMENT':
    case 'NORMAL':
 
      // Do indentation
      indent = get_indent(line);
      if (indent === old_indent + 1) {
        parse_push();
        old_indent = indent;
      }
      while (indent < old_indent) {
        flush_buffer();
        parse_pop();
        old_indent -= 1;
      }
 
      if (line === undefined) {
        continue;
      }
 
      line = line.substr(indent * 2);
 
      // Pass doctype commands through as is
      if (line.substr(0, 3) === '!!!') {
        element.push(line);
        continue;
      }
 
      // Check for special element characters
      var match = line.match(element_regex);
      if (match && match[0].length > 0) {
        parse_element.call(this, line, match[0]);
      } else {
        parse_content.call(this, line);
      }
      break;
    case 'RAW':
      if (get_indent(line) <= indent) {
        flush_buffer();
        process_plugins.call(this);
        mode = "ELEMENT";
        line_index -= 1;
        continue;
      }
      line = line.substr((indent + 1) * 2);
      buffer.push(line);
      break;
    }
  }
 
  if (haml.length === 1 && typeof haml[0] !== 'string') {
    haml = haml[0];
  }
  return haml;
};
 
exports.render = function(content, options) {
  options = options || {}
  var json = Haml.parse.call(options.context || GLOBAL, content)
  p(json)
}
 
