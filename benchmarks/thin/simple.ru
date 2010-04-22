
require 'rubygems'
require 'sinatra'

get '/' do
  'Hello World'
end

run Sinatra::Application