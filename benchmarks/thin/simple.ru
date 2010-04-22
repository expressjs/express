
require 'rubygems'
require 'rack'

app = lambda do |env|
  [200, { 'Content-Type' => 'text/plain' }, 'Hello World']
end

run app