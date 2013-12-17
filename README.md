# wut

A small Javascript templating library.
Probably not very useful in the real world, but it works, and was a joy to build.

Templates, written in Javascript.

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

// Or pollute the scope with some premade tag functions (Coming Soon!):
wut.pollute();

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
script({type: "text/javascript"}, function(){
  var i = 10;
  i += 1;
}.toString() + "();");

/* Outputs:
<script type="text/javascript">
  function (){
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
html({"ng-app":null},
  head(
    script({src:"http://code.angularjs.org/1.2.5/angular.min.js"}),
    script([
      "function HelloCntl($scope) {",
      "  $scope.name = 'World';",
      "}"
    ].join("\n"))
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

## Installation

`npm install wut`

### License

(c) 2013 Alan deLevie. See `package.json` for license.
