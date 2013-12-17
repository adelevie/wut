(function() {
  var _ = require('underscore');

  // Returns a templating function that's sort of curried.
  // Rather than take an object with multiple keys and values, 
  // the returned function takes a single argument.
  var t = function(template, value) {
    return function (value) {
      return _.template(template)({v: value});
    };
  };

  // Returns functions that build "key='value'" pairs for HTML attributes.
  var makeAttr = function(key) {
    return function(value) {
      if (_.isNull(value)) {
        return t(" <%= v %>")(key);
      } else {
        var keyString = t(" <%= v %>=")(key);
        return t(keyString + "\"<%= v %>\"")(value);
      }
    };
  };

  // Creates opening tags, e.g. "<p>" or "<a href='foo'>".
  var openTag = function(name, attributes, selfClosing) {
    var left = t("<<%= v %>")(name);
    var middle = "";
    if (!_.isUndefined(attributes)) {
      middle = _.map(_.keys(attributes), function(key) {
        return makeAttr(key)(attributes[key]);
      }).join("");
    }
    //var right = ">";
    var right = (selfClosing) ? "/>" : ">";
    return left + middle + right;
  };

  // Creates closing tags, e.g. "</p>" or "</a>".
  var closeTag = function(name) {
    return t("</<%= v %>>")(name);
  };

  // Returns functions that create HTML/XML tags.
  // The returned function takes an optional first argument object for the HTML/XML attributes.
  // All or the rest of the arguments are concatenated into a single string.
  var makeTag = function(name) {
    return function() {
      var args, value, attributes, selfClosing;
      
      args = Array.prototype.slice.call(arguments);
      if (_.isObject(_.first(args))) {
        attributes = _.first(args);
        selfClosing = (_.rest(args).length == 0);
        value = _.rest(args).join("");
      } else {
        selfClosing = (args.length == 0);
        value = args.join("");
      };
      if(selfClosing) {
        return t(openTag(name, attributes, true))(value) + "\n";
      } else {
        return t(openTag(name, attributes) + "\n<%= v %>\n" + closeTag(name))(value) + "\n";
      }
    };
  };

  module.exports.makeTag = makeTag;
})();
