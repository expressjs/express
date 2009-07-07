
// Express - Cookie - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

(function(){
  
  Express.Cookie = {
    name : 'cookie',
    
    settings : {
      maxAge : 3600
    },
    
    utilities : {
      
      /**
       * Return cookie _key_. When _value_ is present
       * then a response cookie field will be set.
       *
       * @param  {string} key
       * @param  {string} value
       * @return {string, hash}
       * @api public
       */

      cookie : function(key, value) {
        return value ? Express.response.cookie[key] = value :
                 Express.response.cookie[key]
      }
    },
    
    onRequest : {
      'parse cookie' : function() {
        Express.response.cookie = 
          Express.request.cookie = 
            Express.parseCookie(Express.header('Cookie'))
      }
    },
    
    onResponse : {
      'set cookie' : function() {
        var cookie = []
        for (var key in Express.response.cookie)
          if (Express.response.cookie.hasOwnProperty(key))
            cookie.push(key + '=' + Express.response.cookie[key])
        if (cookie.length)
          Express.header('Set-Cookie', cookie.join('; '))
      }
    }
    
  }
  
})()