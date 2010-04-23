
require 'rubygems'
require 'sinatra'
require 'sass'

configure do
  set 'views', File.dirname(__FILE__) + '/../shared'
end

get '/' do
  sass :'style.css'
end

run Sinatra::Application