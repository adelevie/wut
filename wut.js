(function() {
  var isServer = (typeof window === 'undefined');
  if (isServer) {
    var _ = require('underscore');
  } else {
    var _ = window._;
  }

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
        selfClosing = (_.rest(args).length === 0);
        value = _.rest(args).join("");
        if(_.isFunction(_.last(args))) value = value + "();";
      } else {
        selfClosing = (args.length === 0);
        value = args.join("");
      };
      if(selfClosing) {
        return t(openTag(name, attributes, true))(value) + "\n";
      } else {
        return t(openTag(name, attributes) + "\n<%= v %>\n" + closeTag(name))(value) + "\n";
      }
    };
  };

  var htmlElements = [
    "a","abbr","address","area","article","aside","audio",
    "b","base","bdi","bdo","blockquote","body","br","button",
    "canvas","caption","cite","code","col","colgroup","command",
    "data","datagrid","datalist","dd","del","details","dfn","div","dl","dt",
    "em","embed","eventsource",
    "fieldset","figcaption","figure","footer","form",
    "h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html",
    "i","iframe","img","input","ins",
    "kbd","keygen","label","legend","li","link",
    "mark","map","menu","meta","meter",
    "nav","noscript",
    "object","ol","optgroup","option","output",
    "p","param","pre","progress",
    "q",
    "ruby","rp","rt",
    "s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup",
    "table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track",
    "u","ul",
    "var","video",
    "wbr"
  ];
  
  var doctype = function(type) {
    type = type || "html";
    return "<!DOCTYPE " + type + ">\n";
  }
  
  var pollute = function(scope) {
    _.each(htmlElements, function(e) {
      scope[e] = makeTag(e);
    });
    scope.doctype = doctype;
    return htmlElements;
  }

  var isServer = (typeof window === 'undefined');
  if (isServer) {

    var fs = require('fs');
    var minified = fs.readFileSync('wut.min.js').toString();
    var maxified = fs.readFileSync('wut.js').toString();

    module.exports.makeTag = makeTag;
    module.exports.pollute = pollute
    module.exports.minified = minified;
    module.exports.maxified = maxified;
  } else {
    window.wut = {};
    window.wut.makeTag = makeTag;
    window.wut.pollute = pollute
  }
})();
