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
  console.assert(result == "<html>\nTest\n</html>\n", "html makeTag failed:\n" + result + "\n\n");
});

test("Testing p makeTag with attributes", function() {
  var p = makeTag("p");
  var result = p({class: "test"}, "Testing");
  console.assert(result == "<p class=\"test\">\nTesting\n</p>\n", "p makeTag with attributes failed:\n" + result + "\n\n");
});

test("Testing self-closing tag", function() {
  var input = makeTag("input");
  var result = input({value: "My Input"});
  console.assert(result == "<input value=\"My Input\"/>\n", "input makeTag self-closing tag failed:\n" + result + "\n\n");
});

test("Testing making a multi-line script tag", function() {
  var script = makeTag("script");
  var i = 0;
  var result = script({type: "text/javascript"}, function(){
    var i = 10;
    i += 1;
  }.toString() + "();");
  console.assert(i == 0, "Script has side effects! Failed.");
  console.assert(result == "<script type=\"text/javascript\">\nfunction (){\n    var i = 10;\n    i += 1;\n  }();\n</script>\n", "script tag test failed:\n" + result);
});

console.log("Tests completed successfully. " + tests + " specs, " + tests + " successful, 0 failures.");

