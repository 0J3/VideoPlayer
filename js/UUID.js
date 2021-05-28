"use strict";
exports.__esModule = true;
exports.gen = void 0;
var gen = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
exports.gen = gen;
//# sourceMappingURL=UUID.js.map