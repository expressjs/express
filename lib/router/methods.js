
/*!
 * Express - router - methods
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Hypertext Transfer Protocol -- HTTP/1.1 
 * http://www.ietf.org/rfc/rfc2616.txt
 */

var RFC2616 = ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'];

/**
 * HTTP Extensions for Distributed Authoring -- WEBDAV
 * http://www.ietf.org/rfc/rfc2518.txt
 */

var RFC2518 = ['PROPFIND', 'PROPPATCH', 'MKCOL', 'COPY', 'MOVE', 'LOCK', 'UNLOCK'];

/**
 * Versioning Extensions to WebDAV 
 * http://www.ietf.org/rfc/rfc3253.txt
 */

var RFC3253 = ['VERSION-CONTROL', 'REPORT', 'CHECKOUT', 'CHECKIN', 'UNCHECKOUT', 'MKWORKSPACE', 'UPDATE', 'LABEL', 'MERGE', 'BASELINE-CONTROL', 'MKACTIVITY'];

/**
 * Ordered Collections Protocol (WebDAV) 
 * http://www.ietf.org/rfc/rfc3648.txt
 */

var RFC3648 = ['ORDERPATCH'];

/**
 * Web Distributed Authoring and Versioning (WebDAV) Access Control Protocol 
 * http://www.ietf.org/rfc/rfc3744.txt
 */

var RFC3744 = ['ACL'];

/**
 * Web Distributed Authoring and Versioning (WebDAV) SEARCH
 * http://www.ietf.org/rfc/rfc5323.txt
 */

var RFC5323 = ['SEARCH'];

/**
 * PATCH Method for HTTP 
 * http://www.ietf.org/rfc/rfc5789.txt
 */

var RFC5789 = ['PATCH'];

/**
 * PURGE Method for caching reverse-proxy
 * http://wiki.squid-cache.org/SquidFaq/OperatingSquid#How_can_I_purge_an_object_from_my_cache.3F
 * https://www.varnish-cache.org/docs/trunk/tutorial/purging.html
 */

var CACHE_PURGE = ['PURGE'];

/**
 * Expose the methods.
 */

module.exports = [].concat(
    RFC2616
  , RFC2518
  , RFC3253
  , RFC3648
  , RFC3744
  , RFC5323
  , RFC5789
  , CACHE_PURGE).map(function(method){
    return method.toLowerCase();
  });
