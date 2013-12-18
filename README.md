# wut

A small Javascript templating library.

Don't write Javascript in your templates, write your templates in Javascript.

## Why?

`wut` lets you treat your templates as you would any other part of your program. Javascript developers enjoy having everything be a function, but this pattern seems to break down when it comes to templates. `wut` aims to simplify things. Templates are composed of simple functions that take strings and objects as arguments, and only ever return strings.

Usage:

```javascript
var wut = require('wut');
var makeTag = wut.makeTag;

// Create some tags:
var html = makeTag("html");
var body = makeTag("body");
var ul = makeTag("ul");
var li = makeTag("li");
var p = makeTag("p");
var a = makeTag("a");

// Or pollute the scope with HTML5 premade tag functions:
wut.pollute(this);

// Use a single tag:
p("foo"); 
//=> <p>foo</p>

// Use a self-closing tag by omitting the innerHTML:
hr();
//=> <hr/>

input({value: "mytest"});
//=> <input value="mytest"/>

// Empty string for empty tag:
p("");
//=> <p></p>

// Nest some tags:
doctype("html") +
html(
  body(
    ul(
      li("Item one"),
      li("Item two")
    ),
    hr()
  )
);
//=> <html><body><ul><li>Item one</li><li>Item two</li></ul><hr/></body></html> 

// Set attributes:
a({href: "http://google.com"}, "Click Here");
// => <a href='http://google.com'>Click Here</a>

// Output a script tag with real javascript:
script({type: "text/javascript"}, 
  function() {
    var i = 10;
    i += 1;
  }
);

/* Outputs:
<script type="text/javascript">
  function() {
    var i = 10;
    i += 1;
  }();
</script>
*/

var html = makeTag("html");
var body = makeTag("body");
var p = makeTag("p");
var span = makeTag("span");
var head = makeTag("head");
var script = makeTag("script");
var div = makeTag("div");
var input = makeTag("input");
var hr = makeTag("hr");

// Angular.js app (it actually works!):
doctype("html") +
html({"ng-app":null},
  head(
    script({src:"http://code.angularjs.org/1.2.5/angular.min.js"}),
    script(function() {
      function HelloCntl($scope) {
        $scope.name = 'World'l
      }
    })
  ),
  body(
    div({"ng-controller":"HelloCntl"},
      span(
        p("Your Name: "),
        input({type:"text", "ng-model":"name"}),
        hr(),
        p("Hello {{name || 'world'}}!")
      )
    )
  )
);
```

## Sharing templates between client and server

`wut` makes this easy!

```javascript

```

## Installation

`wut` can run server and client-side. To install in Node:

`npm install wut`

`wut`'s only client-side dependency is Underscore. We're planning on removing this, but for now, be sure to load Underscore before `wut.js` or `wut.min.js`.

If you'd like to use `wut` on the client, and are also using it on the server, use the convenience methods:

```javascript
html(
  head(
    script("urlToUnderscore"),
    script(wut.minified) // or wut.maxified
  ),
  body(
    p("Hi!")
  )
)
```

Yes, `wut` will serve a minified copy of itself. WUT?!

### License

(c) 2013 Alan deLevie. See `package.json` for license.
