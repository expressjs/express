
// JSpec - Shell - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

;(function(){
  
  var _quit = quit
  
  Shell = {
    
    // --- Global
    
    main: this,
    
    // --- Commands
    
    commands: {
      quit: ['Terminate the shell', function(){ _quit() }],
      exit: ['Terminate the shell', function(){ _quit() }],
      p: ['Inspect an object', function(o){ return o.toSource() }]
    },
    
    /**
     * Start the interactive shell.
     *
     * @api public
     */
    
    start : function() {
      for (var name in this.commands)
        if (this.commands.hasOwnProperty(name))
          this.commands[name][1].length ?
            this.main[name] = this.commands[name][1] :
              this.main.__defineGetter__(name, this.commands[name][1])
    }
  }
  
  Shell.start()
  
})()