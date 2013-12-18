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

Because `wut` runs on the client and the server, you just need your client-side code and server-side code to access whatever scope the templates are stored. Here's a sample application that does just that:

```javascript
var isServer = (typeof window === 'undefined');

var wut;
if (isServer) {
  wut = require('wut');
} else {
  wut = window.wut;
}

var makeTag = wut.makeTag;
var html = makeTag("html");
var head = makeTag("head");
var script = makeTag("script");
var body = makeTag("body");
var div = makeTag("div");
var ul = makeTag("ul");
var li = makeTag("li");
var p = makeTag("p");
var a = makeTag("a");

// Notice that this is called in doServer and doClient
var todoTemplate = function(content) {
  return li(a({href: "http://google.com"}, content));
};

var doServer = function() {
  var express = require('express');
  var app = express();
  app.use(express.bodyParser());
  var _ = require('underscore');
  
  var jqCdn = "http://code.jquery.com/jquery-1.10.1.min.js";

  var layout = function(content) {
    return html(
      head(
        script({src: jqCdn}, ""),
        script(wut.minified),
        script({src: "app.js"}, "")
      ),
      body(content)
    );
  };

  var each = function(collection, handler) {
    return _.map(collection, handler).join("");
  };

  app.get('/', function(request, response) {
    var todos = [
      {text: "Get the milk"},
      {text: "Rendered from the server"}
    ];
    var content = div(
      ul({id: "todos"},
        each(todos, function(todo) {
          return todoTemplate(todo.text);
        })
      )
    );
    response.send(layout(content));
  });

  var serveStaticFile = function(route, path) {
    app.get(route, function(request, response) {
      response.sendfile(path);
    });
  };

  serveStaticFile("/app.js", "app.js");

  app.listen(3000);
  console.log('Listening on port 3000');
};

var doClient = function() {
  $(document).ready(function() {
    console.log("Sup, from the client");
    var newTodo = todoTemplate("rendered from client");
    var todosList = $('#todos');
    todosList.append(newTodo);
  });
};

if (isServer) { doServer(); } else { doClient(); }
```

Some fun facts about this app:

- Client and server code are defined in a single file
- `wut` will actually serve a copy of itself. `wut.minified` and `wut.maxified` return strings of its own source. Use with a `script()` tag!
- The server statically serves itself.
- The client calls itself.

## Installation

`wut` can run server and client-side. To install in Node:

`npm install wut`


If you'd like to use `wut` on the client, and are also using it on the server, use the convenience methods:

```javascript
html(
  head(
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
