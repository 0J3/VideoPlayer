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
    if ((browser.family == 'IE' && Number(browser.major) < 12) ||
        ((browser.family == 'Chrome' || browser.family == 'Chrome Mobile') &&
            Number(browser.patch) &&
            Number(browser.patch) < 4000) ||
        (browser.family == 'Firefox' &&
            Number(browser.major) &&
            Number(browser.major) < 78)) {
        return res.send('Unsupported or Outdated Browser. Try <a href="https://firefox.com">the latest Firefox</a>');
    }
    res.send(getHtml_1["default"](req.path.replace('/', ''), browser.family == 'IE'));
});
app.listen(8080, function () {
    console.log('Listening');
});
//# sourceMappingURL=express.js.map