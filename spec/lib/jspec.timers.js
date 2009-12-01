
// Mock Timers - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

;(function(){
  
  /**
   * Version.
   */
   
  mockTimersVersion = '1.0.2'
  
  /**
   * Localized timer stack.
   */
  
  var timers = []
  
  /**
   * Set mock timeout with _callback_ and timeout of _ms_.
   *
   * @param  {function} callback
   * @param  {int} ms
   * @return {int}
   * @api public
   */
  
  setTimeout = function(callback, ms) {
    var id
  	return id = setInterval(function(){
  	  callback()
  	  clearInterval(id)
  	}, ms)
  }
  
  /**
   * Set mock interval with _callback_ and interval of _ms_.
   *
   * @param  {function} callback
   * @param  {int} ms
   * @return {int}
   * @api public
   */

  setInterval = function(callback, ms) {
    callback.step = ms, callback.current = callback.last = 0
    return timers[timers.length] = callback, timers.length
  }
  
  /**
   * Destroy timer with _id_.
   *
   * @param  {int} id
   * @return {bool}
   * @api public
   */

  clearInterval = clearTimeout = function(id) {
    return delete timers[--id]
  }
  
  /**
   * Reset timers.
   *
   * @return {array}
   * @api public
   */
  
  resetTimers = function() {
    return timers = []
  }
  
  /**
   * Increment each timers internal clock by _ms_.
   *
   * @param  {int} ms
   * @api public
   */
  
  tick = function(ms) {
    for (var i = 0, len = timers.length; i < len; ++i)
      if (timers[i] && (timers[i].current += ms))
        if (timers[i].current - timers[i].last >= timers[i].step) {
          var times = Math.floor((timers[i].current - timers[i].last) / timers[i].step)
          var remainder = (timers[i].current - timers[i].last) % timers[i].step
          timers[i].last = timers[i].current - remainder
          while (times-- && timers[i]) timers[i]()
        }
  }
  
})()