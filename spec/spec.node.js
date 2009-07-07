
__loading__ = []
__loadDelay__ = 700

readFile = function(path, callback) {
  __loading__.push(path)
  var promise = node.fs.cat(path, "utf8")
  promise.addErrback(function(){ throw "failed to read file `" + path + "'" })
  promise.addCallback(function(contents){
    setTimeout(function(){
      if (__loading__[0] == path)
        __loading__.shift(), callback(contents)
      else
        setTimeout(arguments.callee, 50)
    }, 50)
  })  
}

load = function(path) {
  readFile(path, function(contents){
    eval(contents)
  })
}

load('/Users/tjholowaychuk/scripts/gems/JSpec/lib/jspec.js')
load('lib/express.core.js')
load('lib/express.mime.js')
load('lib/express.view.js')
load('lib/express.mocks.js')

setTimeout(function(){
  JSpec
  .exec('spec/spec.core.js')
  .exec('spec/spec.routing.js')
  .exec('spec/spec.mime.js')
  .exec('spec/spec.view.js')
  .exec('spec/spec.mocks.js')
  setTimeout(function(){ 
    JSpec.run({ formatter : JSpec.formatters.Terminal, failuresOnly : true })
    setTimeout(function() {
      JSpec.report()
    }, __loadDelay__ / 3)
  }, __loadDelay__ / 3)
}, __loadDelay__ / 3)

