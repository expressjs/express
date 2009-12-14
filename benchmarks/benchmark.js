
;(function(){
	var currentSuite
	
	/**
	 * Contents of _fn_. Strips function literal and signature.
	 *
	 * @param  {function} fn
	 * @return {string}
	 * @api private
	 */
	
	function contentsOf(fn) {
		return fn.toString().match(/^[^\{]*{((.*\n*)*)}/m)[1]
	}
	
	/**
	 * Pad _str_ to _len_.
	 *
	 * @param  {string} str
	 * @param  {integer} len
	 * @return {string}
	 * @api private
	 */
	
	function pad(str, len) {
		return str + (new Array(len - str.length)).join(' ')
	}
	
	/**
	 * Time the execution of _fn_
	 *
	 * @param  {function} fn
	 * @return {float}
	 * @api private
	 */
	
	function time(fn) {
		var start = Number(new Date)
		fn()
		return (Number(new Date) - start) / 1000
	}
	
	/**
	 * Benchmark _fn_ with the given _label_.
	 *
	 * @param {string} label
	 * @param {function} fn
	 * @api public
	 */
	
	function benchmark(label, fn) {
		var duration = time(function(){
			for (var i = 0; i < currentSuite.times; ++i)
				fn()
		}).toFixed(3)
		print(pad('  ' + label, 50 - duration.toString().length) + duration + ' |')
	}
	
	/**
	 * Create a benchmark suite with the given _label_, which
	 * will run each benchmark n _times_. If _times_ is omitted
	 * then it defaults to 1.
	 *
	 * @param  {string} label
	 * @param  {integer, function} times
	 * @param  {function} fn
	 * @api public
	 */
	
	suite = function(label, times, fn) {
		currentSuite = this
		if (typeof times == 'function')
		  this.times = 1, fn = times
    else
		  this.times = times
		print('\n  ' + pad(label, 42 - this.times.toString().length) + this.times + ' time(s)')
		print('  -------------------------------------------------')
		eval(contentsOf(fn))
		print('')
	}
	
})()
