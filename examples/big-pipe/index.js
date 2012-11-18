var express = require('express'),
    zlib = require('zlib');

/**
 * Create a stream so the body is sent using gzip
 * and the page is rendered in the browser as it is received.
 * Using `(connect || express).compress()` will render the page
 * only when the entire page is loaded.
 */

function compressedStream(res) {
  // Would be nice of `connect.compress()` used this instead
  var stream = zlib.createGzip(); // zlib.createDeflate()
  stream._flush = zlib.Z_SYNC_FLUSH;
  stream.pipe(res);
  return stream;
}

/**
 * Message to send to the browser split into words.
 * Send each word in a random interval between 0-5 seconds.
 * Phrase will be displayed in order.
 */

var interval = 5

var message = "Oh, you think darkness is your ally. But you merely adopted the dark; I was born in it, moulded by it. I didn't see the light until I was already a man, by then it was nothing to me but BLINDING! The shadows betray you, because they belong to me!";

var app = express();

// Set response status and headers before writing
app.get('/', function headers(req, res, next) {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.set('Content-Encoding', 'gzip'); // 'deflate'
  res.set('Transfer-Encoding', 'chunked');
  // res.set('Vary', 'Accept-Encoding');
  res.statusCode = 200;
  next();
});

app.get('/', function bigPipe(req, res) {
  if (req.method === 'HEAD') {
    return res.end();
  }

  var stream = compressedStream(res);

  var head = '<!DOCTYPE html><html><head>';
  head += '<style>\n';
  head += 'body { display: table; }\n';
  head += 'div { display: table-row; }\n';
  head += 'span { display: table-cell; padding: 5px; }\n';
  head += '</style>';
  head += '</head>';
  head += '<body>';

  stream.write(head);

  var words = message.split(' '),
      finishedWords = 0,
      startTime = Date.now();

  words.forEach(function(word, index) {
    // Placeholder ID
    var id = 'word-' + index;

    // Placeholder
    stream.write('<div id="' + id + '"></div>');

    var wait = Math.random() * interval * 1000

    // "Asynchronous function call"
    setTimeout(function() {
      var innerHTML = '<span>' + word + '</span>';
      innerHTML += '<span>' + (Date.now() - startTime) + ' millisecond delay</span>';

      // Client-side javascript function to insert the HTML into the placeholder.
      var flush = '<script>document.querySelector(\'#';
      flush += id;
      flush += '\').innerHTML = ';
      flush += JSON.stringify(innerHTML);
      flush += ';</script>';

      stream.write(flush);

      finishedWords++;

      // If we've sent all the words, finish the request.
      if (words.length === finishedWords) {
        stream.end('</body></html>');
      }
    }, wait);
  });
});

app.listen(3000);
console.log('BigPipe example listening on port 3000');