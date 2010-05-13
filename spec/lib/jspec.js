
// JSpec - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

;(function(){

  JSpec = {
    version   : '4.2.1',
    assert    : true,
    cache     : {},
    suites    : [],
    modules   : [],
    allSuites : [],
		sharedBehaviors: [],
    matchers  : {},
    stubbed   : [],
    options   : {},
    request   : 'XMLHttpRequest' in this ? XMLHttpRequest : null,
    stats     : { specs: 0, assertions: 0, failures: 0, passes: 0, specsFinished: 0, suitesFinished: 0 },

    /**
     * Default context in which bodies are evaluated.
     *
     * Replace context simply by setting JSpec.context
     * to your own like below:
     *
     * JSpec.context = { foo : 'bar' }
     *
     * Contexts can be changed within any body, this can be useful
     * in order to provide specific helper methods to specific suites.
     *
     * To reset (usually in after hook) simply set to null like below:
     *
     * JSpec.context = null
     *
     */

     defaultContext : {
      
      /**
       * Return an object used for proxy assertions. 
       * This object is used to indicate that an object
       * should be an instance of _object_, not the constructor
       * itself.
       *
       * @param  {function} constructor
       * @return {hash}
       * @api public
       */
      
      an_instance_of : function(constructor) {
        return { an_instance_of : constructor }
      },
      
      /**
       * Load fixture at _path_.
       *
       * Fixtures are resolved as:
       *
       *  - <path>
       *  - <path>.html
       *
       * @param  {string} path
       * @return {string}
       * @api public
       */
      
      fixture : function(path) {
        if (JSpec.cache[path]) return JSpec.cache[path]
        return JSpec.cache[path] = 
          JSpec.tryLoading(JSpec.options.fixturePath + '/' + path) ||
          JSpec.tryLoading(JSpec.options.fixturePath + '/' + path + '.html')
      },
      
      /**
       * Load json fixture at _path_.
       *
       * JSON fixtures are resolved as:
       *
       *  - <path>
       *  - <path>.json
       *
       * @param  {string} path
       * @return {object}
       * @api public
       */
      
      json_fixture: function(path) {
        if (!JSpec.cache['json:' + path])
          JSpec.cache['json:' + path] =
            JSpec.tryLoading(JSpec.options.fixturePath + '/' + path) ||
            JSpec.tryLoading(JSpec.options.fixturePath + '/' + path + '.json')
        try {
          return eval('(' + JSpec.cache['json:' + path] + ')')
        } catch (e) {
          throw 'json_fixture("' + path + '"): ' + e
        }
      }
    },

    // --- Objects
    
    reporters : {
      
      /**
       * Report to server.
       * 
       * Options:
       *  - uri           specific uri to report to.
       *  - verbose       weither or not to output messages
       *  - failuresOnly  output failure messages only
       *
       * @api public
       */
      
      Server : function(results, options) {
        var uri = options.uri || 'http://' + window.location.host + '/results'
        JSpec.post(uri, {
          stats: JSpec.stats,
          options: options,
          results: map(results.allSuites, function(suite) {
            if (suite.isExecutable())
              return {
                description: suite.description,
                specs: map(suite.specs, function(spec) {
                  return {
                    description: spec.description,
                    message: !spec.passed() ? spec.failure().message : null,
                    status: spec.requiresImplementation() ? 'pending' :
                              spec.passed() ? 'pass' :
                                'fail',
                    assertions: map(spec.assertions, function(assertion){
                      return {
                        passed: assertion.passed  
                      }
                    })
                  }
                })
              }
          })
        })
  			if ('close' in main) main.close()
      },

      /**
       * Default reporter, outputting to the DOM.
       *
       * Options:
       *   - reportToId    id of element to output reports to, defaults to 'jspec'
       *   - failuresOnly  displays only suites with failing specs
       *
       * @api public
       */

      DOM : function(results, options) {
        var id = option('reportToId') || 'jspec',
            report = document.getElementById(id),
            failuresOnly = option('failuresOnly'),
            classes = results.stats.failures ? 'has-failures' : ''
        if (!report) throw 'JSpec requires the element #' + id + ' to output its reports'
        
        function bodyContents(body) {
          return JSpec.
            escape(JSpec.contentsOf(body)).
            replace(/^ */gm, function(a){ return (new Array(Math.round(a.length / 3))).join(' ') }).
            replace(/\r\n|\r|\n/gm, '<br/>')
        }
        
        report.innerHTML = '<div id="jspec-report" class="' + classes + '"><div class="heading"> \
        <span class="passes">Passes: <em>' + results.stats.passes + '</em></span>                \
        <span class="failures">Failures: <em>' + results.stats.failures + '</em></span>          \
        <span class="passes">Duration: <em>' + results.duration + '</em> ms</span>          \
        </div><table class="suites">' + map(results.allSuites, function(suite) {
          var displaySuite = failuresOnly ? suite.ran && !suite.passed() : suite.ran
          if (displaySuite && suite.isExecutable())
            return '<tr class="description"><td colspan="2">' + escape(suite.description) + '</td></tr>' +
              map(suite.specs, function(i, spec) {
                return '<tr class="' + (i % 2 ? 'odd' : 'even') + '">' +
                  (spec.requiresImplementation() ?
                    '<td class="requires-implementation" colspan="2">' + escape(spec.description) + '</td>' :
                      (spec.passed() && !failuresOnly) ?
                        '<td class="pass">' + escape(spec.description)+ '</td><td>' + spec.assertionsGraph() + '</td>' :
                          !spec.passed() ?
                            '<td class="fail">' + escape(spec.description) + 
  													map(spec.failures(), function(a){ return '<em>' + escape(a.message) + '</em>' }).join('') +
 														'</td><td>' + spec.assertionsGraph() + '</td>' :
                              '') +
                  '<tr class="body"><td colspan="2"><pre>' + bodyContents(spec.body) + '</pre></td></tr>'
              }).join('') + '</tr>'
        }).join('') + '</table></div>'
      },
      
      /**
       * Terminal reporter.
       *
       * @api public
       */
       
       Terminal : function(results, options) {
         var failuresOnly = option('failuresOnly')
         print(color("\n Passes: ", 'bold') + color(results.stats.passes, 'green') + 
               color(" Failures: ", 'bold') + color(results.stats.failures, 'red') +
               color(" Duration: ", 'bold') + color(results.duration, 'green') + " ms \n")
              
         function indent(string) {
           return string.replace(/^(.)/gm, '  $1')
         }
         
         each(results.allSuites, function(suite) {
           var displaySuite = failuresOnly ? suite.ran && !suite.passed() : suite.ran
            if (displaySuite && suite.isExecutable()) {
              print(color(' ' + suite.description, 'bold'))
              each(suite.specs, function(spec){
                var assertionsGraph = inject(spec.assertions, '', function(graph, assertion){
                  return graph + color('.', assertion.passed ? 'green' : 'red')
                })
                if (spec.requiresImplementation())
                  print(color('  ' + spec.description, 'blue') + assertionsGraph)
                else if (spec.passed() && !failuresOnly)
                  print(color('  ' + spec.description, 'green') + assertionsGraph)
                else if (!spec.passed())
                  print(color('  ' + spec.description, 'red') + assertionsGraph + 
                        "\n" + indent(map(spec.failures(), function(a){ return a.message }).join("\n")) + "\n")
              })
              print("")
            }
         })
         
         quit(results.stats.failures)
       }
    },
    
    Assertion : function(matcher, actual, expected, negate) {
      extend(this, {
        message: '',
        passed: false,
        actual: actual,
        negate: negate,
        matcher: matcher,
        expected: expected,
        
        // Report assertion results
        
        report : function() {
          if (JSpec.assert) 
            this.passed ? JSpec.stats.passes++ : JSpec.stats.failures++
          return this
        },
        
        // Run the assertion
        
        run : function() {
          // TODO: remove unshifting 
          expected.unshift(actual)
          this.result = matcher.match.apply(this, expected)
          this.passed = negate ? !this.result : this.result
          if (!this.passed) this.message = matcher.message.call(this, actual, expected, negate, matcher.name)
          return this
        }
      })
    },
    
    ProxyAssertion : function(object, method, times, negate) {
      var self = this,
          old = object[method]
      
      // Proxy
      
      object[method] = function(){
        var args = toArray(arguments),
            result = old.apply(object, args)
        self.calls.push({ args : args, result : result })
        return result
      }
      
      // Times
      
      this.times = {
        once  : 1,
        twice : 2
      }[times] || times || 1
      
      extend(this, {
        calls: [],
        message: '',
        defer: true,
        passed: false,
        negate: negate,
        object: object,
        method: method,
        
        // Proxy return value
        
        and_return : function(result) {
          this.expectedResult = result
          return this
        },
        
        // Proxy arguments passed
        
        with_args : function() {
          this.expectedArgs = toArray(arguments)
          return this
        },
        
        // Check if any calls have failing results
        
        anyResultsFail : function() {
          return any(this.calls, function(call){
            return self.expectedResult.an_instance_of ?
                     call.result.constructor != self.expectedResult.an_instance_of:
                       !equal(self.expectedResult, call.result)
          })
        },
        
        // Check if any calls have passing results
        
        anyResultsPass : function() {
          return any(this.calls, function(call){
            return self.expectedResult.an_instance_of ?
                     call.result.constructor == self.expectedResult.an_instance_of:
                       equal(self.expectedResult, call.result)
          })
        },
        
        // Return the passing result
        
        passingResult : function() {
          return this.anyResultsPass().result
        },

        // Return the failing result
        
        failingResult : function() {
          return this.anyResultsFail().result
        },
        
        // Check if any arguments fail
        
        anyArgsFail : function() {
          return any(this.calls, function(call){
            return any(self.expectedArgs, function(i, arg){
              if (arg == null) return call.args[i] == null
              return arg.an_instance_of ?
                       call.args[i].constructor != arg.an_instance_of:
                         !equal(arg, call.args[i])
                       
            })
          })
        },
        
        // Check if any arguments pass
        
        anyArgsPass : function() {
          return any(this.calls, function(call){
            return any(self.expectedArgs, function(i, arg){
              return arg.an_instance_of ?
                       call.args[i].constructor == arg.an_instance_of:
                         equal(arg, call.args[i])
                       
            })
          })
        },
        
        // Return the passing args
        
        passingArgs : function() {
          return this.anyArgsPass().args
        },
                
        // Return the failing args
        
        failingArgs : function() {
          return this.anyArgsFail().args
        },
        
        // Report assertion results
        
        report : function() {
          if (JSpec.assert) 
            this.passed ? ++JSpec.stats.passes : ++JSpec.stats.failures
          return this
        },
        
        // Run the assertion
                
        run : function() {
          var methodString = 'expected ' + object.toString() + '.' + method + '()' + (negate ? ' not' : '' )
          
          function times(n) {
            return n > 2 ?  n + ' times' : { 1: 'once', 2: 'twice' }[n]
          }
          
          if (this.expectedResult != null && (negate ? this.anyResultsPass() : this.anyResultsFail()))
            this.message = methodString + ' to return ' + puts(this.expectedResult) + 
              ' but ' + (negate ? 'it did' : 'got ' + puts(this.failingResult())) 

          if (this.expectedArgs && (negate ? !this.expectedResult && this.anyArgsPass() : this.anyArgsFail()))
            this.message = methodString + ' to be called with ' + puts.apply(this, this.expectedArgs) +
             ' but was' + (negate ? '' : ' called with ' + puts.apply(this, this.failingArgs()))

          if (negate ? !this.expectedResult && !this.expectedArgs && this.calls.length >= this.times : this.calls.length != this.times)
            this.message = methodString + ' to be called ' + times(this.times) + 
            ', but ' +  (this.calls.length == 0 ? ' was not called' : ' was called ' + times(this.calls.length))
                
          if (!this.message.length) 
            this.passed = true
          
          return this
        }
      })
    },
      
    /**
     * Specification Suite block object.
     *
     * @param {string} description
     * @param {function} body
     * @api private
     */

    Suite : function(description, body, isShared) {
      var self = this
      extend(this, {
        body: body,
        description: description,
        suites: [],
				sharedBehaviors: [],
        specs: [],
        ran: false,
				shared: isShared, 
				hooks: { 	'before' : [], 'after' : [], 
									'before_each' : [], 'after_each' : [],
									'before_nested' : [], 'after_nested' : []},
        
				// Add a spec to the suite

        addSpec : function(description, body) {
          var spec = new JSpec.Spec(description, body)
          this.specs.push(spec)
          JSpec.stats.specs++ // TODO: abstract
          spec.suite = this
        },

        // Add a before hook to the suite

        addBefore : function(options, body) {
					body.options = options || {}
          this.befores.push(body)
        },

        // Add an after hook to the suite

        addAfter : function(options, body) {
					body.options = options || {}
          this.afters.unshift(body)
        },

        // Add a hook to the suite
 
        addHook : function(hook, body) {
          this.hooks[hook].push(body)
        },

        // Add a nested suite

        addSuite : function(description, body, isShared) {
          var suite = new JSpec.Suite(description, body, isShared)
          JSpec.allSuites.push(suite)
          suite.name = suite.description
          suite.description = this.description + ' ' + suite.description
          this.suites.push(suite)
          suite.suite = this
        },

				// Invoke a hook in context to this suite

        hook : function(hook) {
					if (hook != 'before' && hook != 'after')	
          	if (this.suite) this.suite.hook(hook)

          each(this.hooks[hook], function(body) {
            JSpec.evalBody(body, "Error in hook '" + hook + "', suite '" + self.description + "': ")
          })
        },
				
        // Check if nested suites are present

        hasSuites : function() {
          return this.suites.length  
        },

        // Check if this suite has specs

        hasSpecs : function() {
          return this.specs.length
        },

        // Check if the entire suite passed

        passed : function() {
          return !any(this.specs, function(spec){
            return !spec.passed() 
          })
        },

				isShared : function(){
					return this.shared
				},

				isExecutable : function() {
					return !this.isShared() && this.hasSpecs()
				}
      })
    },
    
    /**
     * Specification block object.
     *
     * @param {string} description
     * @param {function} body
     * @api private
     */

    Spec : function(description, body) {
      extend(this, {
        body: body,
        description: description,
        assertions: [],
        
        // Add passing assertion
        
        pass : function(message) {
          this.assertions.push({ passed: true, message: message })
          if (JSpec.assert) ++JSpec.stats.passes
        },
        
        // Add failing assertion
        
        fail : function(message) {
          this.assertions.push({ passed: false, message: message })
          if (JSpec.assert) ++JSpec.stats.failures
        },
                
        // Run deferred assertions
        
        runDeferredAssertions : function() {
          each(this.assertions, function(assertion){
            if (assertion.defer) assertion.run().report(), hook('afterAssertion', assertion)
          })
        },
        
        // Find first failing assertion

        failure : function() {
          return find(this.assertions, function(assertion){
            return !assertion.passed
          })
        },

        // Find all failing assertions

        failures : function() {
          return select(this.assertions, function(assertion){
            return !assertion.passed
          })
        },

        // Weither or not the spec passed

        passed : function() {
          return !this.failure()
        },

        // Weither or not the spec requires implementation (no assertions)

        requiresImplementation : function() {
          return this.assertions.length == 0
        },

        // Sprite based assertions graph

        assertionsGraph : function() {
          return map(this.assertions, function(assertion){
            return '<span class="assertion ' + (assertion.passed ? 'passed' : 'failed') + '"></span>'
          }).join('')
        }
      })
    },
    
    Module : function(methods) {
      extend(this, methods)
    },
    
    JSON : {
      
      /**
       * Generic sequences.
       */
      
      meta : {
        '\b' : '\\b',
        '\t' : '\\t',
        '\n' : '\\n',
        '\f' : '\\f',
        '\r' : '\\r',
        '"'  : '\\"',
        '\\' : '\\\\'
      },
      
      /**
       * Escapable sequences.
       */
      
      escapable : /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      
      /**
       * JSON encode _object_.
       *
       * @param  {mixed} object
       * @return {string}
       * @api private
       */
       
      encode : function(object) {
        var self = this
        if (object == undefined || object == null) return 'null'
        if (object === true) return 'true'
        if (object === false) return 'false'
        switch (typeof object) {
          case 'number': return object
          case 'string': return this.escapable.test(object) ?
            '"' + object.replace(this.escapable, function (a) {
              return typeof self.meta[a] === 'string' ? self.meta[a] :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' :
            '"' + object + '"'
          case 'object':  
            if (object.constructor == Array)
              return '[' + map(object, function(val){
                return self.encode(val)
              }).join(', ') + ']'
            else if (object)
              return '{' + map(object, function(key, val){
                return self.encode(key) + ':' + self.encode(val)
              }).join(', ') + '}'
        }
        return 'null'
      }
    },
    
    // --- DSLs
    
    DSLs : {
      snake : {
        expect : function(actual){
          return JSpec.expect(actual)
        },

        describe : function(description, body) {
          return JSpec.currentSuite.addSuite(description, body, false)
        },

        it : function(description, body) {
          return JSpec.currentSuite.addSpec(description, body)
        },

        before : function(body) {
          return JSpec.currentSuite.addHook('before', body)
        },
 
        after : function(body) {
          return JSpec.currentSuite.addHook('after', body)
        },
 
        before_each : function(body) {
          return JSpec.currentSuite.addHook('before_each', body)
        },
 
        after_each : function(body) {
          return JSpec.currentSuite.addHook('after_each', body)
        },

				before_nested : function(body) {
					return JSpec.currentSuite.addHook('before_nested', body)
				},
				
				after_nested : function(body){
					return JSpec.currentSuite.addhook('after_nested', body)
				},
        
				shared_behaviors_for : function(description, body){
				  return JSpec.currentSuite.addSuite(description, body, true)
				},

        should_behave_like : function(description) {
          return JSpec.shareBehaviorsOf(description)
        }
      }
    },

    // --- Methods
    
    /**
     * Check if _value_ is 'stop'. For use as a
     * utility callback function.
     *
     * @param  {mixed} value
     * @return {bool}
     * @api public
     */
    
    haveStopped : function(value) {
      return value === 'stop'
    },
    
    /**
     * Include _object_ which may be a hash or Module instance.
     *
     * @param  {hash, Module} object
     * @return {JSpec}
     * @api public
     */
    
    include : function(object) {
      var module = object.constructor == JSpec.Module ? object : new JSpec.Module(object)
      this.modules.push(module)
      if ('init' in module) module.init()
      if ('utilities' in module) extend(this.defaultContext, module.utilities)
      if ('matchers' in module) this.addMatchers(module.matchers)
      if ('reporters' in module) extend(this.reporters, module.reporters)
      if ('DSLs' in module)
        each(module.DSLs, function(name, methods){
          JSpec.DSLs[name] = JSpec.DSLs[name] || {}
          extend(JSpec.DSLs[name], methods)
        })
      return this
    },
    
    /**
     * Add a module hook _name_, which is immediately
     * called per module with the _args_ given. An array of
     * hook return values is returned.
     *
     * @param  {name} string
     * @param  {...} args
     * @return {array}
     * @api private
     */
    
    hook : function(name, args) {
      args = toArray(arguments, 1)
      return inject(JSpec.modules, [], function(results, module){
        if (typeof module[name] == 'function')
          results.push(JSpec.evalHook(module, name, args))
      })
    },
    
    /**
     * Eval _module_ hook _name_ with _args_. Evaluates in context
     * to the module itself, JSpec, and JSpec.context.
     *
     * @param  {Module} module
     * @param  {string} name
     * @param  {array} args
     * @return {mixed}
     * @api private
     */
    
    evalHook : function(module, name, args) {
      hook('evaluatingHookBody', module, name)
      return module[name].apply(module, args)
    },
    
    /**
     * Same as hook() however accepts only one _arg_ which is
     * considered immutable. This function passes the arg
     * to the first module, then passes the return value of the last
     * module called, to the following module. 
     *
     * @param  {string} name
     * @param  {mixed} arg
     * @return {mixed}
     * @api private
     */
    
    hookImmutable : function(name, arg) {
      return inject(JSpec.modules, arg, function(result, module){
        if (typeof module[name] == 'function')
          return JSpec.evalHook(module, name, [result])
      })
    },
    
    /**
     * Find a shared example suite by its description or name.
     * First searches parent tree of suites for shared behavior
     * before falling back to global scoped nested behaviors.
     *
     * @param  {string} description
     * @return {Suite}
     * @api private
     */
    
    findSharedBehavior : function(description) {
      var behavior
      return (behavior = JSpec.findLocalSharedBehavior(description))
        ? behavior
        : JSpec.findGlobalSharedBehavior(description)
    },

    /**
     * Find a shared example suite within the current suite's
     * parent tree by its description or name.
     *
     * @param  {string} description
     * @return {Suite}
     * @api private
     */
     
		findLocalSharedBehavior : function(description) {
			var behavior,
			    currentSuite = JSpec.currentSuite.suite
			while (currentSuite)
				if (behavior = find(currentSuite.suites, JSpec.suiteDescriptionPredicate(description)))
				  return behavior
				else
				  currentSuite = currentSuite.suite
		},
		
    /**
     * Find a shared example suite within the global
     * scope by its description or name.
     *
     * @param  {string} description
     * @return {Suite}
     * @api private
     */
     
		findGlobalSharedBehavior : function(description) {
	   return find(JSpec.suites, JSpec.suiteDescriptionPredicate(description))
		},
    
    /**
     * Build a predicate that will match a suite based on name or description
     *
     * @param  {string} description
     * @return {function}
     * @api private
     */
     
		suiteDescriptionPredicate : function(description) {
			return function(suite){
			  return suite.name === description ||
			         suite.description === description
			}
		},

    /**
     * Share behaviors (specs) of the given suite with
     * the current suite.
     *
     * @param  {string} description
     * @api public
     */
    
    shareBehaviorsOf : function(description) {
      var suite = JSpec.findSharedBehavior(description)
      if (suite)
        JSpec.evalBody(suite.body)
      else
        throw new Error("failed to find shared behaviors named `" + description + "'")
    },
    
    
    /**
     * Convert arguments to an array.
     *
     * @param  {object} arguments
     * @param  {int} offset
     * @return {array}
     * @api public
     */
    
    toArray : function(arguments, offset) {
      return Array.prototype.slice.call(arguments, offset || 0)
    },
    
    /**
     * Return ANSI-escaped colored string.
     *
     * @param  {string} string
     * @param  {string} color
     * @return {string}
     * @api public
     */
    
    color : function(string, color) {
      if (option('disableColors')) {
        return string
      } else {
        return "\u001B[" + {
         bold    : 1,
         black   : 30,
         red     : 31,
         green   : 32,
         yellow  : 33,
         blue    : 34,
         magenta : 35,
         cyan    : 36,
         white   : 37
        }[color] + 'm' + string + "\u001B[0m"
      }
    },
    
    /**
     * Default matcher message callback.
     *
     * @api private
     */
    
    defaultMatcherMessage : function(actual, expected, negate, name) {
      return 'expected ' + puts(actual) + ' to ' + 
               (negate ? 'not ' : '') + 
                  name.replace(/_/g, ' ') +
                    ' ' + (expected.length > 1 ?
                      puts.apply(this, expected.slice(1)) :
                        '')
    },
    
    /**
     * Normalize a matcher message.
     *
     * When no messge callback is present the defaultMatcherMessage
     * will be assigned, will suffice for most matchers.
     *
     * @param  {hash} matcher
     * @return {hash}
     * @api public
     */
    
    normalizeMatcherMessage : function(matcher) {
      if (typeof matcher.message != 'function') 
        matcher.message = this.defaultMatcherMessage
      return matcher
    },
    
    /**
     * Normalize a matcher body
     * 
     * This process allows the following conversions until
     * the matcher is in its final normalized hash state.
     *
     * - '==' becomes 'actual == expected'
     * - 'actual == expected' becomes 'return actual == expected'
     * - function(actual, expected) { return actual == expected } becomes 
     *   { match : function(actual, expected) { return actual == expected }}
     *
     * @param  {mixed} body
     * @return {hash}
     * @api public
     */
    
    normalizeMatcherBody : function(body) {
      var captures
      switch (body.constructor) {
        case String:
          if (captures = body.match(/^alias (\w+)/)) return JSpec.matchers[last(captures)]
          if (body.length < 4) body = 'actual ' + body + ' expected'
          return { match: function(actual, expected) { return eval(body) }}  
          
        case Function:
          return { match: body }
          
        default:
          return body
      }
    },
    
    /**
     * Get option value. This method first checks if
     * the option key has been set via the query string,
     * otherwise returning the options hash value.
     *
     * @param  {string} key
     * @return {mixed}
     * @api public
     */
     
     option : function(key) {
       return (value = query(key)) !== null ? value :
                JSpec.options[key] || null
     },
     
     /**
      * Check if object _a_, is equal to object _b_.
      *
      * @param  {object} a
      * @param  {object} b
      * @return {bool}
      * @api private
      */
     
     equal: function(a, b) {
       if (typeof a != typeof b) return
       if (a === b) return true
       if (a instanceof RegExp)
         return a.toString() === b.toString()
       if (a instanceof Date)
         return Number(a) === Number(b)
       if (typeof a != 'object') return
       if (a.length !== undefined)
         if (a.length !== b.length) return
         else
           for (var i = 0, len = a.length; i < len; ++i)
             if (!equal(a[i], b[i]))
               return
       for (var key in a)
         if (!equal(a[key], b[key]))
           return
       return true
     },

    /**
     * Return last element of an array.
     *
     * @param  {array} array
     * @return {object}
     * @api public
     */

    last : function(array) {
      return array[array.length - 1]
    },

    /**
     * Convert object(s) to a print-friend string.
     *
     * @param  {...} object
     * @return {string}
     * @api public
     */

    puts : function(object) {
      if (arguments.length > 1)
        return map(toArray(arguments), function(arg){
          return puts(arg)
        }).join(', ')
      if (object === undefined) return 'undefined'
      if (object === null) return 'null'
      if (object === true) return 'true'
      if (object === false) return 'false'
      if (object.an_instance_of) return 'an instance of ' + object.an_instance_of.name
      if (object.jquery && object.selector.length > 0) return 'selector ' + puts(object.selector)
      if (object.jquery) return object.get(0).outerHTML
      if (object.nodeName) return object.outerHTML
      switch (object.constructor) {
        case Function: return object.name || object 
        case String: 
          return '"' + object
            .replace(/"/g,  '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\t/g, '\\t')
            + '"'
        case Array: 
          return inject(object, '[', function(b, v){
            return b + ', ' + puts(v)
          }).replace('[,', '[') + ' ]'
        case Object:
          object.__hit__ = true
          return inject(object, '{', function(b, k, v) {
            if (k == '__hit__') return b
            return b + ', ' + k + ': ' + (v && v.__hit__ ? '<circular reference>' : puts(v))
          }).replace('{,', '{') + ' }'
        default: 
          return object.toString()
      }
    },

    /**
     * Parse an XML String and return a 'document'.
     *
     * @param {string} text
     * @return {document}
     * @api public
     */

    parseXML : function(text) {
      var xmlDoc
      if (window.DOMParser)
        xmlDoc = (new DOMParser()).parseFromString(text, "text/xml")
      else {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM")
        xmlDoc.async = "false"
        xmlDoc.loadXML(text)
      }
      return xmlDoc
    },

    /**
     * Escape HTML.
     *
     * @param  {string} html
     * @return {string}
     * @api public
     */

     escape : function(html) {
       return html.toString()
         .replace(/&/gmi, '&amp;')
         .replace(/"/gmi, '&quot;')
         .replace(/>/gmi, '&gt;')
         .replace(/</gmi, '&lt;')
     },
     
     /**
      * Perform an assertion without reporting.
      *
      * This method is primarily used for internal
      * matchers in order retain DRYness. May be invoked 
      * like below:
      *
      *   does('foo', 'eql', 'foo')
      *   does([1,2], 'include', 1, 2)
      *
      * External hooks are not run for internal assertions
      * performed by does().
      *
      * @param  {mixed} actual
      * @param  {string} matcher
      * @param  {...} expected
      * @return {mixed}
      * @api private
      */
     
     does : function(actual, matcher, expected) {
       var assertion = new JSpec.Assertion(JSpec.matchers[matcher], actual, toArray(arguments, 2))
       return assertion.run().result
     },

    /**
     * Perform an assertion.
     *
     *   expect(true).to('be', true)
     *   expect('foo').not_to('include', 'bar')
     *   expect([1, [2]]).to('include', 1, [2])
     *
     * @param  {mixed} actual
     * @return {hash}
     * @api public
     */

    expect : function(actual) {
      function assert(matcher, args, negate) {
        var expected = toArray(args, 1)
        matcher.negate = negate  
        var assertion = new JSpec.Assertion(matcher, actual, expected, negate)
        hook('beforeAssertion', assertion)
        if (matcher.defer) assertion.run()
        else JSpec.currentSpec.assertions.push(assertion.run().report()), hook('afterAssertion', assertion)
        return assertion.result
      }
      
      function to(matcher) {
        return assert(matcher, arguments, false)
      }
      
      function not_to(matcher) {
        return assert(matcher, arguments, true)
      }
      
      return {
        to : to,
        should : to,
        not_to: not_to,
        should_not : not_to
      }
    },

    /**
     * Strim whitespace or chars.
     *
     * @param  {string} string
     * @param  {string} chars
     * @return {string}
     * @api public
     */

     strip : function(string, chars) {
       return string.
         replace(new RegExp('['  + (chars || '\\s') + ']*$'), '').
         replace(new RegExp('^[' + (chars || '\\s') + ']*'),  '')
     },
     
     /**
      * Call an iterator callback with arguments a, or b
      * depending on the arity of the callback.
      *
      * @param  {function} callback
      * @param  {mixed} a
      * @param  {mixed} b
      * @return {mixed}
      * @api private
      */
     
     callIterator : function(callback, a, b) {
       return callback.length == 1 ? callback(b) : callback(a, b)
     },
     
     /**
      * Extend an object with another.
      *
      * @param  {object} object
      * @param  {object} other
      * @api public
      */
     
     extend : function(object, other) {
       each(other, function(property, value){
         object[property] = value
       })
     },
     
     /**
      * Iterate an object, invoking the given callback.
      *
      * @param  {hash, array} object
      * @param  {function} callback
      * @return {JSpec}
      * @api public
      */

     each : function(object, callback) {
       if (object.constructor == Array)
         for (var i = 0, len = object.length; i < len; ++i)
           callIterator(callback, i, object[i])
       else
         for (var key in object) 
           if (object.hasOwnProperty(key))
             callIterator(callback, key, object[key])
     },

     /**
      * Iterate with memo.
      *
      * @param  {hash, array} object
      * @param  {object} memo
      * @param  {function} callback
      * @return {object}
      * @api public
      */

     inject : function(object, memo, callback) {
       each(object, function(key, value){
         memo = (callback.length == 2 ?
                   callback(memo, value):
                     callback(memo, key, value)) ||
                       memo
       })
       return memo
     },
     
     /**
      * Destub _object_'s _method_. When no _method_ is passed
      * all stubbed methods are destubbed. When no arguments
      * are passed every object found in JSpec.stubbed will be
      * destubbed.
      *
      * @param  {mixed} object
      * @param  {string} method
      * @api public
      */
     
     destub : function(object, method) {
       var captures
       if (method) {
         if (object['__prototype__' + method])
           delete object[method]
         else
           object[method] = object['__original__' + method]
         delete object['__prototype__' + method]
         delete object['__original____' + method]
       }
       else if (object) {
         for (var key in object)
           if (captures = key.match(/^(?:__prototype__|__original__)(.*)/))
             destub(object, captures[1])
       }
       else
         while (JSpec.stubbed.length)
            destub(JSpec.stubbed.shift())
     },
     
     /**
      * Stub _object_'s _method_. 
      *
      * stub(foo, 'toString').and_return('bar')
      *
      * @param  {mixed} object
      * @param  {string} method
      * @return {hash}
      * @api public
      */
     
     stub : function(object, method) {
       hook('stubbing', object, method)
       JSpec.stubbed.push(object)
       var type = object.hasOwnProperty(method) ? '__original__' : '__prototype__'
       object[type + method] = object[method]
       object[method] = function(){}
       return {
         and_return : function(value) {
           if (typeof value == 'function') object[method] = value
           else object[method] = function(){ return value }
         }
      }
     },
     
    /**
     * Map callback return values.
     *
     * @param  {hash, array} object
     * @param  {function} callback
     * @return {array}
     * @api public
     */

    map : function(object, callback) {
      return inject(object, [], function(memo, key, value){
        memo.push(callIterator(callback, key, value))
      })
    },
    
    /**
     * Returns the first matching expression or null.
     *
     * @param  {hash, array} object
     * @param  {function} callback
     * @return {mixed}
     * @api public
     */
         
    any : function(object, callback) {
      return inject(object, null, function(state, key, value){
        if (state == undefined)
          return callIterator(callback, key, value) ? value : state
      })
    },
    
    /**
     * Returns an array of values collected when the callback
     * given evaluates to true.
     *
     * @param  {hash, array} object
     * @return {function} callback
     * @return {array}
     * @api public
     */
    
    select : function(object, callback) {
      return inject(object, [], function(selected, key, value){
        if (callIterator(callback, key, value))
          selected.push(value)
      })
    },

    /**
     * Define matchers.
     *
     * @param  {hash} matchers
     * @api public
     */

    addMatchers : function(matchers) {
      each(matchers, function(name, body){
        JSpec.addMatcher(name, body)  
      })
    },
    
    /**
     * Define a matcher.
     *
     * @param  {string} name
     * @param  {hash, function, string} body
     * @api public
     */
    
    addMatcher : function(name, body) {
      hook('addingMatcher', name, body)
      if (name.indexOf(' ') != -1) {
        var matchers = name.split(/\s+/)
        var prefix = matchers.shift()
        each(matchers, function(name) {
          JSpec.addMatcher(prefix + '_' + name, body(name))
        })
      }
      this.matchers[name] = this.normalizeMatcherMessage(this.normalizeMatcherBody(body))
      this.matchers[name].name = name
    },
    
    /**
     * Add a root suite to JSpec.
     *
     * @param  {string} description
     * @param  {body} function
     * @api public
     */
    
    describe : function(description, body) {
      var suite = new JSpec.Suite(description, body, false)
      hook('addingSuite', suite)
      this.allSuites.push(suite)
      this.suites.push(suite)
    },
    
    /**
     * Add a shared example suite to JSpec.
     *
     * @param  {string} description
     * @param  {body} function
     * @api public
     */
    
    shared_behaviors_for : function(description, body) {
      var suite = new JSpec.Suite(description, body, true)
      hook('addingSuite', suite)
      this.allSuites.push(suite)
      this.suites.push(suite)
    },

    /**
     * Return the contents of a function body.
     *
     * @param  {function} body
     * @return {string}
     * @api public
     */
    
    contentsOf : function(body) {
      return body.toString().match(/^[^\{]*{((.*\n*)*)}/m)[1]
    },

    /**
     * Evaluate a JSpec capture body.
     *
     * @param  {function} body
     * @param  {string} errorMessage (optional)
     * @return {Type}
     * @api private
     */

    evalBody : function(body, errorMessage) {
      var dsl = this.DSL || this.DSLs.snake
      var matchers = this.matchers
      var context = this.context || this.defaultContext
      var contents = this.contentsOf(body)
			hook('evaluatingBody', dsl, matchers, context, contents)
      with (dsl){ with (context) { with (matchers) { eval(contents) }}}
    },

    /**
     * Pre-process a string of JSpec.
     *
     * @param  {string} input
     * @return {string}
     * @api private
     */

    preprocess : function(input) {
      if (typeof input != 'string') return
      input = hookImmutable('preprocessing', input)
      return input.
        replace(/\t/g, '  ').
        replace(/\r\n|\n|\r/g, '\n').
        split('__END__')[0].
        replace(/([\w\.]+)\.(stub|destub)\((.*?)\)$/gm, '$2($1, $3)').
        replace(/describe\s+(.*?)$/gm, 'describe($1, function(){').
        replace(/shared_behaviors_for\s+(.*?)$/gm, 'shared_behaviors_for($1, function(){').
        replace(/^\s+it\s+(.*?)$/gm, ' it($1, function(){').
				replace(/^ *(before_nested|after_nested|before_each|after_each|before|after)(?= |\n|$)/gm, 'JSpec.currentSuite.addHook("$1", function(){').
        replace(/^\s*end(?=\s|$)/gm, '});').
        replace(/-\{/g, 'function(){').
        replace(/(\d+)\.\.(\d+)/g, function(_, a, b){ return range(a, b) }).
        replace(/\.should([_\.]not)?[_\.](\w+)(?: |;|$)(.*)$/gm, '.should$1_$2($3)').
        replace(/([\/\s]*)(.+?)\.(should(?:[_\.]not)?)[_\.](\w+)\((.*)\)\s*;?$/gm, '$1 expect($2).$3($4, $5)').
        replace(/, \)/g, ')').
        replace(/should\.not/g, 'should_not')
    },

    /**
     * Create a range string which can be evaluated to a native array.
     *
     * @param  {int} start
     * @param  {int} end
     * @return {string}
     * @api public
     */

    range : function(start, end) {
      var current = parseInt(start), end = parseInt(end), values = [current]
      if (end > current) while (++current <= end) values.push(current)
      else               while (--current >= end) values.push(current)
      return '[' + values + ']'
    },

    /**
     * Report on the results. 
     *
     * @api public
     */

    report : function() {
      this.duration = Number(new Date) - this.start
      hook('reporting', JSpec.options)
      new (JSpec.options.reporter || JSpec.reporters.DOM)(JSpec, JSpec.options)
    },

    /**
     * Run the spec suites. Options are merged
     * with JSpec options when present.
     *
     * @param  {hash} options
     * @return {JSpec}
     * @api public
     */

    run : function(options) {
      if (any(hook('running'), haveStopped)) return this
      if (options) extend(this.options, options)
      this.start = Number(new Date)
      each(this.suites, function(suite) { JSpec.runSuite(suite) })
      return this
    },
    
    /**
     * Run a suite.
     *
     * @param  {Suite} suite
     * @api public
     */

    runSuite : function(suite) {
			if (!suite.isShared())
			{
	      this.currentSuite = suite
	      this.evalBody(suite.body)
	      suite.ran = true
	      hook('beforeSuite', suite), suite.hook('before'), suite.hook('before_nested')
	      each(suite.specs, function(spec) {
	        hook('beforeSpec', spec)
	        suite.hook('before_each')
	        JSpec.runSpec(spec)
	        hook('afterSpec', spec)
	        suite.hook('after_each')
	      })
	      if (suite.hasSuites()) {
	        each(suite.suites, function(suite) {
	          JSpec.runSuite(suite)
	        })
	      }
	      hook('afterSuite', suite), suite.hook('after_nested'), suite.hook('after')
	      this.stats.suitesFinished++
			}	
		},
         
    /**
     * Report a failure for the current spec.
     *
     * @param  {string} message
     * @api public
     */
     
     fail : function(message) {
       JSpec.currentSpec.fail(message)
     },
     
     /**
      * Report a passing assertion for the current spec.
      *
      * @param  {string} message
      * @api public
      */
      
     pass : function(message) {
       JSpec.currentSpec.pass(message)
     },

    /**
     * Run a spec.
     *
     * @param  {Spec} spec
     * @api public
     */

    runSpec : function(spec) {
      this.currentSpec = spec
      try { this.evalBody(spec.body) }
      catch (e) { fail(e) }
      spec.runDeferredAssertions()
      destub()
      this.stats.specsFinished++
      this.stats.assertions += spec.assertions.length
    },

    /**
     * Require a dependency, with optional message.
     *
     * @param  {string} dependency
     * @param  {string} message (optional)
     * @return {JSpec}
     * @api public
     */

    requires : function(dependency, message) {
      hook('requiring', dependency, message)
      try { eval(dependency) }
      catch (e) { throw 'JSpec depends on ' + dependency + ' ' + message }
      return this
    },

    /**
     * Query against the current query strings keys
     * or the queryString specified.
     *
     * @param  {string} key
     * @param  {string} queryString
     * @return {string, null}
     * @api private
     */

    query : function(key, queryString) {
      var queryString = (queryString || (main.location ? main.location.search : null) || '').substring(1)
      return inject(queryString.split('&'), null, function(value, pair){
        parts = pair.split('=')
        return parts[0] == key ? parts[1].replace(/%20|\+/gmi, ' ') : value
      })
    },

    /**
     * Ad-hoc POST request for JSpec server usage.
     *
     * @param  {string} uri
     * @param  {string} data
     * @api private
     */
    
    post : function(uri, data) {
      if (any(hook('posting', uri, data), haveStopped)) return
      var request = this.xhr()
      request.open('POST', uri, false)
      request.setRequestHeader('Content-Type', 'application/json')
      request.send(JSpec.JSON.encode(data))
    },

    /**
     * Instantiate an XMLHttpRequest.
     *
     * Here we utilize IE's lame ActiveXObjects first which
     * allow IE access serve files via the file: protocol, otherwise
     * we then default to XMLHttpRequest.
     *
     * @return {XMLHttpRequest, ActiveXObject}
     * @api private
     */
    
    xhr : function() {
      return this.ieXhr() || new JSpec.request
    },
    
    /**
     * Return Microsoft piece of crap ActiveXObject.
     *
     * @return {ActiveXObject}
     * @api public
     */
    
    ieXhr : function() {
      function object(str) {
        try { return new ActiveXObject(str) } catch(e) {}
      }
      return object('Msxml2.XMLHTTP.6.0') ||
        object('Msxml2.XMLHTTP.3.0') ||
        object('Msxml2.XMLHTTP') ||
        object('Microsoft.XMLHTTP')
    },
    
    /**
     * Check for HTTP request support.
     *
     * @return {bool}
     * @api private
     */
    
    hasXhr : function() {
      return JSpec.request || 'ActiveXObject' in main
    },
    
    /**
     * Try loading _file_ returning the contents
     * string or null. Chain to locate / read a file.
     *
     * @param  {string} file
     * @return {string}
     * @api public
     */
    
    tryLoading : function(file) {
      try { return JSpec.load(file) } catch (e) {}
    },

    /**
     * Load a _file_'s contents.
     *
     * @param  {string} file
     * @param  {function} callback
     * @return {string}
     * @api public
     */

    load : function(file, callback) {
      if (any(hook('loading', file), haveStopped)) return
      if ('readFile' in main)
        return readFile(file)
      else if (this.hasXhr()) {
        var request = this.xhr()
        request.open('GET', file, false)
        request.send(null)
        if (request.readyState == 4 && 
           (request.status == 0 || 
            request.status.toString().charAt(0) == 2)) 
          return request.responseText
      }
      else
        throw new Error("failed to load `" + file + "'")
    },

    /**
     * Load, pre-process, and evaluate a file.
     *
     * @param {string} file
     * @param {JSpec}
     * @api public
     */

    exec : function(file) {
      if (any(hook('executing', file), haveStopped)) return this
      eval('with (JSpec){' + this.preprocess(this.load(file)) + '}')
      return this
    }
  }
  
  // --- Node.js support
  
  if (typeof GLOBAL === 'object' && typeof exports === 'object')
    quit = process.exit,
    print = require('sys').puts,
    readFile = require('fs').readFileSync
  
  // --- Utility functions

  var main = this,
      find = JSpec.any,
      utils = 'haveStopped stub hookImmutable hook destub map any last pass fail range each option inject select \
               error escape extend puts query strip color does addMatchers callIterator toArray equal'.split(/\s+/)
  while (utils.length) eval('var ' + utils[0] + ' = JSpec.' + utils.shift())
  if (!main.setTimeout) main.setTimeout = function(callback){ callback() }

  // --- Matchers

  addMatchers({
    equal              : "===",
    eql                : "equal(actual, expected)",
    be                 : "alias equal",
    be_greater_than    : ">",
    be_less_than       : "<",
    be_at_least        : ">=",
    be_at_most         : "<=",
    be_a               : "actual.constructor == expected",
    be_an              : "alias be_a",
    be_an_instance_of  : "actual instanceof expected",
    be_null            : "actual == null",
    be_true            : "actual == true",
    be_false           : "actual == false",
    be_undefined       : "typeof actual == 'undefined'",
    be_type            : "typeof actual == expected",
    match              : "typeof actual == 'string' ? actual.match(expected) : false",
    respond_to         : "typeof actual[expected] == 'function'",
    have_length        : "actual.length == expected",
    be_within          : "actual >= expected[0] && actual <= last(expected)",
    have_length_within : "actual.length >= expected[0] && actual.length <= last(expected)",
    
    receive : { defer : true, match : function(actual, method, times) {
      var proxy = new JSpec.ProxyAssertion(actual, method, times, this.negate)
      JSpec.currentSpec.assertions.push(proxy)
      return proxy
    }},
    
    be_empty : function(actual) {
      if (actual.constructor == Object && actual.length == undefined)
        for (var key in actual)
          return false;
      return !actual.length
    },

    include : function(actual) {
      for (var state = true, i = 1; i < arguments.length; i++) {
        var arg = arguments[i]
        switch (actual.constructor) {
          case String: 
          case Number:
          case RegExp:
          case Function:
            state = actual.toString().indexOf(arg) !== -1
            break
         
          case Object:
            state = arg in actual
            break
          
          case Array: 
            state = any(actual, function(value){ return equal(value, arg) })
            break
        }
        if (!state) return false
      }
      return true
    },

    throw_error : { match : function(actual, expected, message) {
      try { actual() }
      catch (e) {
        this.e = e
        var assert = function(arg) {
          switch (arg.constructor) {
            case RegExp   : return arg.test(e.message || e.toString())
            case String   : return arg == (e.message || e.toString())
            case Function : return e instanceof arg || e.name == arg.name
          }
        }
        return message ? assert(expected) && assert(message) :
                 expected ? assert(expected) :
                   true
      }
    }, message : function(actual, expected, negate) {
      // TODO: refactor when actual is not in expected [0]
      var message_for = function(i) {
        if (expected[i] == undefined) return 'exception'
        switch (expected[i].constructor) {
          case RegExp   : return 'exception matching ' + puts(expected[i])
          case String   : return 'exception of ' + puts(expected[i])
          case Function : return expected[i].name || 'Error'
        }
      }
      var exception = message_for(1) + (expected[2] ? ' and ' + message_for(2) : '')
      return 'expected ' + exception + (negate ? ' not ' : '' ) +
               ' to be thrown, but ' + (this.e ? 'got ' + puts(this.e) : 'nothing was')
    }},
    
    have : function(actual, length, property) {
      return actual[property] == null ? false : actual[property].length == length
    },
    
    have_at_least : function(actual, length, property) {
      return actual[property] == null ? (length === 0) : actual[property].length >= length
    },
    
    have_at_most :function(actual, length, property) {
      return actual[property] == null || actual[property].length <= length
    },
    
    have_within : function(actual, range, property) {
      var length = actual[property] == undefined ? 0 : actual[property].length
      return length >= range.shift() && length <= range.pop()
    },
    
    have_prop : function(actual, property, value) {
      return actual[property] === undefined ||
               actual[property] instanceof Function ? false:
                 value === undefined ? true:
                   does(actual[property], 'eql', value)
    },
    
    have_property : function(actual, property, value) {
      return actual[property] === undefined ||
               actual[property] instanceof Function ? false:
                 value === undefined ? true:
                   value === actual[property]
    }
  })
  
})()
