
require 'rubygems'
require 'sinatra'

get '/' do
  send_file 'benchmarks/shared/huge.js'
end

run Sinatra::Application