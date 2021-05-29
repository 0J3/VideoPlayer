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
var statuses = [
    100,
    101,
    102,
    103,
    200,
    201,
    202,
    203,
    204,
    205,
    206,
    207,
    208,
    218,
    226,
    300,
    301,
    302,
    303,
    304,
    305,
    306,
    307,
    308,
    400,
    401,
    402,
    403,
    404,
    405,
    406,
    407,
    408,
    409,
    410,
    411,
    412,
    413,
    414,
    415,
    416,
    417,
    418,
    420,
    421,
    422,
    423,
    424,
    425,
    428,
    429,
    430,
    431,
    444,
    451,
    494,
    495,
    496,
    497,
    499,
    500,
    501,
    502,
    503,
    504,
    505,
    506,
    507,
    508,
    510,
    511,
    520,
    521,
    522,
    523,
    524,
    525,
    526,
    527,
    530,
];
var statusHtml = '';
statuses.forEach(function (s) {
    statusHtml += "<a href=\"/status/" + s + "/\">" + s + "</a><br/>";
});
app.get('/status/:status', function (req, res, next) {
    if (req.params.status &&
        Number(req.params.status) &&
        statuses.includes(Number(req.params.status)))
        res.status(Number(req.params.status)).send();
    else
        res
            .status(400)
            .send("Please specify a status. Valid Status codes are: " + statusHtml);
    return;
});
app.get('/*', function (req, res) {
    res.send(getHtml_1["default"](req.path.replace('/', '')));
});
app.listen(p, function () {
    console.log('Listening on port', p);
});
//# sourceMappingURL=express.js.map