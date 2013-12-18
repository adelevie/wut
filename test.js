/**
 *  For TDD:
 *  gem install when-files-change
 *  when-files-change "clear && node test.js"
 *
 *  Or just run once: node test.js
 */

var tests = 0;
function test(name, testFn) {
  console.log(name);
  tests += 1;
  testFn();
}

var wut = require("./wut");
var makeTag = wut.makeTag;

test("Testing html makeTag", function() {
  var html = makeTag("html");
  var result = html("Test");
  console.assert(result === "<html>\nTest\n</html>\n", "html makeTag failed:\n" + result + "\n\n");
});

test("Testing p makeTag with attributes", function() {
  var p = makeTag("p");
  var result = p({class: "test"}, "Testing");
  console.assert(result === "<p class=\"test\">\nTesting\n</p>\n", "p makeTag with attributes failed:\n" + result + "\n\n");
});

test("Testing self-closing tag", function() {
  var input = makeTag("input");
  var result = input({value: "My Input"});
  console.assert(result === "<input value=\"My Input\"/>\n", "input makeTag self-closing tag failed:\n" + result + "\n\n");
});

test("Testing making a multi-line script tag explicitly", function() {
  var script = makeTag("script");
  var i = 0;
  var result = script({type: "text/javascript"}, function(){
    i = 10;
    i += 1;
  }.toString() + "();");
  console.assert(i === 0, "Script has side effects! Failed.");
  console.assert(result === "<script type=\"text/javascript\">\nfunction (){\n    i = 10;\n    i += 1;\n  }();\n</script>\n", "explicit script tag test failed:\n" + result);
});

test("Testing making a multi-line script tag implicitly", function() {
  var script = makeTag("script");
  var i = 0;
  var result = script({type: "text/javascript"}, function(){
    i = 10;
    i += 1;
  });
  console.assert(i == 0, "Script has side effects! Failed.");
  console.assert(result == "<script type=\"text/javascript\">\nfunction (){\n    i = 10;\n    i += 1;\n  }();\n</script>\n", "implicit script tag test failed:\n" + result);
});

_this = this;
test("Testing pollute", function() {
  elements = wut.pollute(this);
  console.assert(elements.length > 100, "htmlElements doesn't contain enough elements. Contains: " + elements.length + " HTML elements.");

  console.assert(typeof this.html === "function", "pollute didn't create html function");
  console.assert(typeof this.p === "function", "pollute didn't create p function");
  console.assert(typeof this.div === "function", "pollute didn't create div function");
  console.assert(typeof this.article === "function", "pollute didn't create article function");
  console.assert(typeof _this.html !== "function", "pollute contaminated outside scope.");
});

test("Testing doctype special function", function() {
  wut.pollute(this);
  console.assert(doctype() === "<!DOCTYPE html>\n", "implicit doctype function failed:\n" + doctype());
  console.assert(doctype("html5") === "<!DOCTYPE html5>\n", "explicit doctype function failed:\n" + doctype("html"));
});

test("Testing serving its own boostrapped minified self", function() {
  var minified = wut.minified;
  console.assert(typeof minified === 'string');
});

test("Testing serving its own boostrapped normal self", function() {
  var maxified = wut.maxified;
  console.assert(typeof maxified === 'string');
});

console.log("Tests completed successfully. " + tests + " specs, " + tests + " successful, 0 failures.");

