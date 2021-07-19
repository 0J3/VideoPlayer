"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var isDebug = '%isDebug%'.toString() == 'true';
var start = typeof performance !== 'undefined' && typeof performance.now !== 'undefined'
    ? performance.now()
    : null;
var initHover = function (moveTimeout) {
    document['%isHover%'] = function (e) { return e.parentElement.querySelector(':hover') === e; };
    document['%playerVar%'] = document.getElementById('%playerid%');
    document['%sourceElId%'] = document.getElementById('%sourceElId%');
    document['%sourceElId%'].src = '%url%';
    document['%controlsid%'] = document.getElementById('%controlsid%');
    var MouseMove = function () {
        if (document['%playerVar%']) {
            document['%hovering%'] =
                document['%isHover%'](document['%playerVar%']) ||
                    document['%isHover%'](document['%controlsid%']);
            if (document['%isHover%'].bool !== document['%hovering%']) {
                if (document['%hovering%']) {
                    document['%playerVar%'].classList.add('%activeControls%');
                    document['%controlsid%'].classList.add('%activeControls%');
                    document['%playerVar%'].classList.remove('%inactiveControls%');
                    document['%controlsid%'].classList.remove('%inactiveControls%');
                    if (document['%moved%'])
                        clearTimeout(document['%moved%']);
                    document['%moved%'] = setTimeout(function () {
                        document['%playerVar%'].classList.remove('%activeControls%');
                        document['%controlsid%'].classList.remove('%activeControls%');
                        document['%playerVar%'].classList.add('%inactiveControls%');
                        document['%controlsid%'].classList.add('%inactiveControls%');
                        document['%moved%'] = setTimeout(function () {
                            document['%isHover%'].bool = false;
                        }, 500);
                    }, moveTimeout);
                }
                else {
                    document['%playerVar%'].classList.remove('%activeControls%');
                    document['%controlsid%'].classList.remove('%activeControls%');
                    document['%playerVar%'].classList.add('%inactiveControls%');
                    document['%controlsid%'].classList.add('%inactiveControls%');
                }
                document['%isHover%'].bool = document['%hovering%'];
            }
        }
    };
    document.addEventListener('mousemove', MouseMove);
    document['%mouseMoveFunc%'] = MouseMove;
};
document['updateRange'] = true;
document['updateBar'] = function () {
    var dur = document['%playerVar%'].duration;
    var time = document['%playerVar%'].currentTime;
    if (document['updateRange'])
        document['%progressId%'].value = time / dur;
};
document['setProgressToRange'] = function () {
    var dur = document['%playerVar%'].duration;
    var time = document['%progressId%'].value;
    document['%playerVar%'].currentTime = time * dur;
};
var volItem;
document.addEventListener('DOMContentLoaded', function () {
    var maxVol = 2;
    volItem = document.getElementById('%volumeId%');
    var lsVol = localStorage.getItem('Volume-%url%') || localStorage.getItem('Volume');
    var vol = Number(typeof lsVol === 'undefined' ? 1 : lsVol);
    var setPlayerVol = function () {
        console.log(vol);
        document['%playerVar%'].volume = vol / maxVol;
    };
    var setVolume = function (volume) {
        if (volume > 2)
            throw new Error('Volume ' + vol + ' is > max volume of ' + maxVol);
        if (volume < 0)
            throw new Error('Volume ' + vol + ' is < min volume of 0');
        localStorage.setItem('Volume', volume.toString());
        localStorage.setItem('Volume-%url%', volume.toString());
        vol = volume;
        setPlayerVol();
    };
    document['changeVolume'] = function (volume) {
        var target = Math.min(Math.max(vol + volume, 0), 2);
        setVolume(target);
        volItem['value'] = vol;
    };
    document['updateVolume'] = function () {
        var val = volItem['value'];
        setVolume(val);
    };
    volItem['value'] = vol;
    setPlayerVol();
});
var initControls = function () {
    document['%progressId%'] = document.getElementById('%progressId%');
    document['%PlayId%'] = document.getElementById('%PlayId%');
    var updateSvg = function () {
        document['playsvg'] = document.getElementById('playsvg');
        if (document['playsvg'] == null) {
            document['playsvg'] = document['%PlayId%'].firstChild.firstChild;
        }
        if (document['%playerVar%'].paused)
            document['playsvg'].setAttribute('d', 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z');
        else
            document['playsvg'].setAttribute('d', 'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z');
    };
    var interval;
    var play = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, document['%playerVar%'].play()];
                case 1:
                    _a.sent();
                    interval = setInterval(document['updateBar'], 20);
                    return [3, 3];
                case 2:
                    error_1 = _a.sent();
                    return [3, 3];
                case 3: return [2];
            }
        });
    }); };
    var pause = function () {
        document['%playerVar%'].pause();
        if (interval)
            clearInterval(interval);
    };
    document['%playFunc%'] = function () {
        if (document['%playerVar%'].paused)
            play();
        else
            pause();
        updateSvg();
    };
    document['play'] = play;
    document['pause'] = pause;
    setImmediate(function () {
        play().catch(function () { });
        updateSvg();
    });
    console.log('baka');
};
initHover(2.5e3);
initControls();
var seek = function (time) { return (document['%playerVar%'].currentTime += time); };
var Keybind = (function () {
    function Keybind(key, callback) {
        this.key = key.toLowerCase();
        this.callback = callback;
    }
    return Keybind;
}());
var Keymap = (function () {
    function Keymap() {
        this._keymap = [];
    }
    Keymap.prototype.set = function (keyBind) {
        this._keymap.push(keyBind);
    };
    Keymap.prototype.get = function (keyName) {
        keyName = keyName.toLowerCase();
        for (var i in this._keymap) {
            if (Object.prototype.hasOwnProperty.call(this._keymap, i)) {
                var keybind = this._keymap[i];
                if (keybind.key === keyName) {
                    return keybind;
                }
            }
        }
        return 'KeybindDoesNotExist';
    };
    return Keymap;
}());
document.addEventListener('DOMContentLoaded', function () {
    var time = document.getElementById('time');
    var player = document['%playerVar%'];
    var format = function (time) {
        var x = function (a) {
            a = a.toString();
            if (a.length === 1)
                return "0" + a;
            else
                return a;
        };
        time = Math.floor(time);
        return x((time - (time % 60)) / 60) + ':' + x(time - (time - (time % 60)));
    };
    var setText = function (s) {
        if (time.innerText !== s)
            time.innerText = s;
    };
    setInterval(function () {
        setText(format(player['currentTime']) + ' / ' + format(player['duration']));
    }, 1000);
});
(function () {
    var keymap = new Keymap();
    document['keyMap'] = keymap;
    keymap.set(new Keybind('ArrowUp', function () { return document['changeVolume'](0.1); }));
    keymap.set(new Keybind('ArrowDown', function () { return document['changeVolume'](-0.1); }));
    keymap.set(new Keybind('ArrowLeft', function () { return seek(-5); }));
    keymap.set(new Keybind('ArrowRight', function () { return seek(5); }));
    keymap.set(new Keybind(' ', document['%playFunc%']));
    document.addEventListener('keydown', function (_a) {
        var key = _a.key;
        var keybind = keymap.get(key);
        if (isDebug)
            console.log('[Keybind Debug] Key Pressed:', key, '- Keybind:', keybind);
        if (keybind == 'KeybindDoesNotExist')
            return;
        keybind.callback();
    });
})();
if (isDebug &&
    typeof performance !== 'undefined' &&
    typeof performance.now !== 'undefined') {
    console.log('[' +
        new Date().toLocaleTimeString() +
        '] Ready! (Took ' +
        (performance.now() - start) +
        'ms)');
}
//# sourceMappingURL=../ts/js/clientCode.js.map