
require.paths.unshift 'lib'
require 'express'
require 'express/plugins'

configure ->
  use MethodOverride
  use ContentLength
  use Cookie
  use Session
  use Flash
  use Logger
  use Static
  set 'root', __dirname

get '/', ->
  @redirect('/upload')

get '/upload', ->
  @render 'upload.html.haml', {
    locals: {
      flashes: @flash 'info'
    }
  }

post '/upload', ->
  @param('images').each (image) =>
    puts image.filename + ' -> ' + image.tempfile
    @flash 'info', 'Uploaded ' + image.filename
  @redirect '/upload'

get '/*.css', (file) ->
  @render file + '.css.sass', { layout: no }

run()