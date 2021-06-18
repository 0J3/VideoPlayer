"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.generateUnique = exports.getUrl = exports.generateWithArgs = void 0;
var fs = require("fs");
var minifier = require("html-minifier");
var uglifyjs = require("uglify-js");
var svgo_1 = require("svgo");
var UUID_1 = require("./UUID");
var url_1 = require("url");
var path_1 = require("path");
var debugMode = true;
var svgDir = path_1.resolve('svg/');
var minify = debugMode
    ? function (v) {
        return v;
    }
    : minifier.minify;
var minifyOptions = {
    removeAttributeQuotes: true,
    html5: true,
    removeOptionalTags: false,
    removeEmptyElements: false,
    removeComments: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: false,
    removeScriptTypeAttributes: true,
    removeTagWhitespace: false,
    removeStyleLinkTypeAttributes: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    quoteCharacter: "'",
    keepClosingSlash: false
};
var uglify = function (s) {
    return debugMode ? s : uglifyjs.minify(s).code;
};
var minifysvg = function (s) {
    return debugMode
        ? s
        : svgo_1.optimize(s, {
            multipass: true
        }).data;
};
var template = fs.readFileSync('./othersrc/template.html').toString();
var base = 'https://github.com/0J3/random/raw/main/';
var uids = [];
var generateWithArgs = function (args) {
    var html = template;
    for (var key in args) {
        if (Object.prototype.hasOwnProperty.call(args, key)) {
            var element = args[key];
            html = html
                .split('VAR_' + key)
                .join("%" + key + "%")
                .split("%" + key + "%")
                .join(element);
        }
    }
    return html;
};
exports.generateWithArgs = generateWithArgs;
var getUrl = function (path) {
    if (path === void 0) { path = 'https://github.com/0J3/random/raw/main/hri.mp4'; }
    if (path.startsWith('//')) {
        path = path.replace('//', 'https://');
    }
    else if (path.startsWith('/')) {
        path = new url_1.URL(path.replace('/', ''), base).toString();
    }
    else if (path == '' || !path) {
        path = 'https://github.com/0J3/random/raw/main/hri.mp4';
    }
    if (!path.startsWith('https')) {
        if (path.startsWith('http://')) {
            path = path.replace('http://', 'https://');
        }
        else if (path.startsWith('//')) {
            path = 'https:' + path;
        }
        else if (path.split('/')[0].includes('.') && path.split('/').length > 1) {
            path = 'https://' + path;
        }
        else {
            path = base + '/' + path;
        }
    }
    return path;
};
exports.getUrl = getUrl;
var generateUnique = function (name) {
    if (debugMode)
        return name;
    var uid = name + '_' + UUID_1.gen().split('-').join('');
    if (uids.includes(uid)) {
        return exports.generateUnique(name);
    }
    else {
        uids[uids.length] = uid;
        return uid;
    }
};
exports.generateUnique = generateUnique;
var svgs = {};
fs.readdirSync(svgDir).forEach(function (v) {
    svgs[v] = minifysvg(fs.readFileSync(path_1.resolve(svgDir, v)).toString());
});
var clientCode = uglify(fs.readFileSync('./js/clientCode.js').toString());
var css = fs.readFileSync('./othersrc/css/css.css').toString();
var ie11css = fs.readFileSync('./othersrc/css/ie11css.css').toString();
exports["default"] = (function (path, isIe) {
    if (path === void 0) { path = ''; }
    if (isIe === void 0) { isIe = false; }
    var playerVar = exports.generateUnique('playerVar');
    var playerid = exports.generateUnique('PlayerID');
    var controlsid = exports.generateUnique('ControlsID');
    var url = exports.getUrl(path);
    var script = clientCode;
    var sourceElId = exports.generateUnique('sourceElId');
    var moved = exports.generateUnique('Moved');
    var hovering = exports.generateUnique('Hovering');
    var isHover = exports.generateUnique('IsHover');
    var activeControls = exports.generateUnique('ActiveControls');
    var inactiveControls = exports.generateUnique('InactiveControls');
    var playFunc = exports.generateUnique('playFunc');
    var pauseFunc = exports.generateUnique('pauseFunc');
    var mouseMoveFunc = exports.generateUnique('mouseMoveFunc');
    var PlayId = exports.generateUnique('PlayId');
    var progressId = exports.generateUnique('progressId');
    var volumeId = exports.generateUnique('volumeId');
    var style = css;
    if (isIe) {
        style = ie11css;
    }
    return minify(exports.generateWithArgs(__assign({ script: "<script>" + script + "</script>", style: "<style>" + style + "</style>", url: url,
        playerVar: playerVar,
        playerid: playerid,
        controlsid: controlsid,
        sourceElId: sourceElId,
        moved: moved,
        hovering: hovering,
        isHover: isHover,
        activeControls: activeControls,
        inactiveControls: inactiveControls,
        playFunc: playFunc,
        pauseFunc: pauseFunc,
        mouseMoveFunc: mouseMoveFunc,
        PlayId: PlayId,
        progressId: progressId,
        volumeId: volumeId, isDebug: debugMode }, svgs)), minifyOptions);
});
//# sourceMappingURL=getHtml.js.map