"use strict";
exports.__esModule = true;
var e = require("express");
var path = require("path");
var uaParser = require("ua-parser");
var getHtml_1 = require("./getHtml");
var app = e();
app.use('/svg/', e.static(path.resolve('svg/')));
app.get('/*', function (req, res) {
    var browser = uaParser.parseUA(req.headers['user-agent']);
    res.send(getHtml_1["default"](req.path.replace('/', ''), browser.family == 'IE'));
});
app.listen(8080, function () {
    console.log('Listening');
});
//# sourceMappingURL=express.js.map