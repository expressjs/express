
require 'rubygems'
require 'sinatra'

get '/' do
  send_file 'benchmarks/shared/jquery.js'
end

run Sinatra::Application