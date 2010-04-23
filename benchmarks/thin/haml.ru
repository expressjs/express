
require 'rubygems'
require 'sinatra'
require 'haml'

configure do
  set 'views', File.dirname(__FILE__) + '/../shared'
end

get '/' do
  haml :page
end

run Sinatra::Application