
load('/Library/Ruby/Gems/1.8/gems/visionmedia-jspec-2.3.1/lib/jspec.js')
load('lib/express.core.js')
load('lib/express.mime.js')
load('lib/express.builder.js')

JSpec
.exec('spec/spec.core.js')
.exec('spec/spec.routing.js')
.exec('spec/spec.mime.js')
.exec('spec/spec.builder.js')
.run({ failuresOnly : true, formatter : JSpec.formatters.Terminal })
.report()