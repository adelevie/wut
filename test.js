var wut = require("./wut");
var makeTag = wut.makeTag;
 
var html = makeTag("html");
var testHTML = html("Test");
console.assert(testHTML == "<html>\nTest\n</html>\n", "html makeTag failed");
 
var input = makeTag("input","/");
var testInput = input({value: "My Input"});
console.assert(testInput == "<input value=\"My Input\"/>\n", "input makeTag self-closing tag failed");