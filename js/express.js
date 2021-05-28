"use strict";
exports.__esModule = true;
var e = require("express");
var path = require("path");
var getHtml_1 = require("./getHtml");
var p = 6794;
var app = e();
app.use('/svg/', e.static(path.resolve('svg/')));
app.get('/player/', function (req, res, next) {
    res.send(getHtml_1["default"](req.path.replace('/', '').replace('player/', '/')));
    next();
});
app.get('/*', function (req, res) {
    res.send(getHtml_1["default"](req.path.replace('/', '')));
});
app.listen(p, function () {
    console.log('Listening on port', p);
});
//# sourceMappingURL=express.js.map