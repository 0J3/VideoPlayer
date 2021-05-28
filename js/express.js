"use strict";
exports.__esModule = true;
var e = require("express");
var path = require("path");
var getHtml_1 = require("./getHtml");
var app = e();
app.use('/svg/', e.static(path.resolve('svg/')));
app.get('/*', function (req, res) {
    res.send(getHtml_1["default"](req.path.replace('/', '')));
});
app.listen(8080, function () {
    console.log('Listening');
});
//# sourceMappingURL=express.js.map