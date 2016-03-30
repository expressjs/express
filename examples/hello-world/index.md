# Expressjs -  Hello world

Were kicking things off with the obilgatory hello world express application. 

### Basic example 

```js 
var express = require('express')
var app = express() 

app.get('/', function(req, res) { 
    res.send('Hello world')
})

app.listen(3000, function() {
    console.log('app is running @ port: 3000')
})
```

So we bring in the express library with  
` var express = require('express')`

then we store the express library in a variable name `app` 
now we can start using http methods such as `get`, `post`, `delete` & more 
but for now we will utilize - `get` in this example. 

```js 
app.get('/', function(req, res) {
    res.send('Hello world')
})
```
So pay mind to `req & res` which is truncated for request & response 
you see `res.send('Hello world')` all is happening here is when you go 
localhost:3000 (for example) your code is telling the webpage to respond 
with the inserted message in the string,  you can as well think of it as
when you visit '/' the result will be `Hello world` so when you see
`res.send` think of it as `result` but the proper term is `response`

```js
app.listen(3000, function() {
    console.log('app is running @ port: 3000')
})
```
now we're setting our application to run on port `3000`
& the `console.log('app is running @ port: 3000')` is for our 
viewing pleasure. That is what we will see in the terminal, just 
letting us know our app is fine and running at the port 3000

Well that's all for now, don't worry you will soon slay much bigger apps
thanks for spending time with express -hello world


