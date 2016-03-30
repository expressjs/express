# Expressjs with Pug
### formally known as jade
Pug is a template engine

```bash
$ npm install pug 
```

Pug is a clean, whitespace sensitive syntax for writing html.

There are several templating languages, such as [hbs](handlebars.com), [ejs](https://www.npmjs.com/package/ejs), [mustace](https://www.npmjs.com/package/mustache) & more
but we will be taking a delve into [Pug](pug-lang.com), which happens to be the default template language 
for NodeJs. 


```js
app.set('view engine', 'pug')
app.set('views', './views')
```
so since pug is a template language and not a library we don't have to 
`require` it. So to use pug, we tell our app what template language we'll 
be using as the example above. And the `views`, `./views` we are telling 
out app that we have a directory named views and that we're we will operate 
our pug files in that `directory`. So the `app.set` is spot on, because that's 
what we're doing is setting up template engine & setting views to operate out 
of  the views file. 

speaking of files, their will be a few of them, depending on the size of the app
your working on. For example you are likely to see `index.jade` & `layout.jade`
but again it depends on what type of app your building. eg if you're building a 
blog you probably would go with `index.jade`,`blog.jade`,`layout.jade`. So for 
`index.jade` is like index.html this is your main page for the structure of your 
website. `blog.jade` is when people visit `/blog` page then this functions as your
structure for that page. 

### Here is working example 
	


`-layout.jade`
```js
doctype html
html(lang="en")
    head
    body
        h1 Hello World
        block myblock
```
`-index.jade`
```js
extends layout
    block myblock
        p Jade is cool
```

An html view of the result 
```html
<!DOCTYPE html>
<html lang="en">
<head>
<body>
    <h1>Hello World</h1>
    <p>Jade is cool</p>
</body>
</html>
```

you can use space or tabs, but it's very important 
to indent. Indentation is key in Pug. 

play with it [here](pug-lang.com) to get more of a grasp on it.

for now let's go into a few more features before ending this tutorial.

```js
div(id="content", class="main")
  a(href="http://expressjsguide.com", title="Express.js Guide", target="_blank") Express.js Guide
  form(action="/login")
    button(type="submit, value="save")
div(class="hero-unit") Lean Node.js!
```
turns into 
```html
<div id="content" class="main"><a href="http://expressjsguide.com" title="Express.js Guide"
target="_blank">Express.js Guide</a>
  <form action="/login">
    <button type="submit" value="save"></button>
  </form>
  <div class="hero-unit">Learn Node.js</div>
</div>
```

### Mixins
Mixins allow you to create reusable blocks of jade. For example
lets look at this. 

`Pug`
```js
//- Declaration
mixin list
  ul
    li foo
    li bar
    li baz
//- Use
+list
+list
```
An `html` view of it 
```html 
<ul>
  <li>foo</li>
  <li>bar</li>
  <li>baz</li>
</ul>
<ul>
  <li>foo</li>
  <li>bar</li>
  <li>baz</li>
</ul>
```
They are compiled to functions and can take arguments
`Pug`

```js
mixin pet(name)
  li.pet= name
ul
  +pet('cat')
  +pet('dog')
  +pet('pig')
```
`HTML`
```html
<ul>
  <li class="pet">cat</li>
  <li class="pet">dog</li>
  <li class="pet">pig</li>
</ul>
```

### Includes
Includes allow you to insert the contents of one jade file into another.


`//- index.jade`
```js
doctype html
html
  include ./includes/head.jade
  body
    h1 My Site
    p Welcome to my super lame site.
    include ./includes/foot.jade
```
`//- includes/head.jade`
```js
head
  title My Site
  script(src='/javascripts/jquery.js')
  script(src='/javascripts/app.js')
```
`//- includes/foot.jade`
```js
#footer
  p Copyright (c) foobar
```


### Attributes
here are a few examples to get you familiar with syntax
```js
a(href='google.com') Google
a(class='button', href='google.com') Google
```
```html
<a href="google.com">Google</a><a href="google.com" class="button">Google</a>
```

<b>( style )</b>
 
```js
a(style={color: 'red', background: 'green'})
```
```html
<a style="color:red;background:green"></a>
```


<b>( class )</b>

the `.` suffices for `class` word

```js
  a.button                    .content 
```
```html 
<a class="button"></a>      <div class="content"></div>
```


<b>( id )</b>

the `#` octothrope or pound key works for `id` word  

div's are such a common choice of tag, it is the default if you omit the tag name 
```js
  a#main-link                 #content 
```

```html
<a id="main-link"></a>      <div id="content"></div>
```

