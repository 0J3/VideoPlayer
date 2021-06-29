const isDebug = '%isDebug%'.toString() == 'true';

const start =
	typeof performance !== 'undefined' && typeof performance.now !== 'undefined'
		? performance.now()
		: null;

// ANCHOR Initialise hover
const initHover = (moveTimeout: number) => {
	document['%isHover%'] = (e: {
		parentElement: { querySelector: (arg0: string) => any };
	}) => e.parentElement.querySelector(':hover') === e;

	document['%playerVar%'] = document.getElementById('%playerid%');
	document['%sourceElId%'] = document.getElementById('%sourceElId%');
	document['%sourceElId%'].src = '%url%';
	document['%controlsid%'] = document.getElementById('%controlsid%');

	const MouseMove = () => {
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
					if (document['%moved%']) clearTimeout(document['%moved%']);

					// if (!document['%isHover%'](document['%controlsid%']))
					document['%moved%'] = setTimeout(() => {
						document['%playerVar%'].classList.remove('%activeControls%');
						document['%controlsid%'].classList.remove('%activeControls%');
						document['%playerVar%'].classList.add('%inactiveControls%');
						document['%controlsid%'].classList.add('%inactiveControls%');
						document['%moved%'] = setTimeout(() => {
							document['%isHover%'].bool = false;
						}, 500);
					}, moveTimeout);
				} else {
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
document['updateBar'] = () => {
	const dur = document['%playerVar%'].duration;
	const time = document['%playerVar%'].currentTime;

	if (document['updateRange']) document['%progressId%'].value = time / dur;
};
document['setProgressToRange'] = () => {
	const dur = document['%playerVar%'].duration;
	const time = document['%progressId%'].value;

	document['%playerVar%'].currentTime = time * dur;
};

// ANCHOR Volume
let volItem: HTMLElement;
document.addEventListener('DOMContentLoaded', () => {
	const maxVol = 2;
	volItem = document.getElementById('%volumeId%');
	const lsVol =
		localStorage.getItem('Volume-%url%') || localStorage.getItem('Volume');
	let vol: number = Number(typeof lsVol === 'undefined' ? 1 : lsVol);
	const setPlayerVol = () => {
		document['%playerVar%'].volume = vol / maxVol;
	};
	const setVolume = (volume: number) => {
		if (volume > 2)
			throw new Error('Volume ' + vol + ' is > max volume of ' + maxVol);
		if (volume < 0) throw new Error('Volume ' + vol + ' is < min volume of 0');
		localStorage.setItem('Volume', volume.toString());
		localStorage.setItem('Volume-%url%', volume.toString());
		vol = volume;
		setPlayerVol();
	};
	document['changeVolume'] = (volume: number) => {
		const target = Math.min(Math.max(vol + volume, 0), 2);

		setVolume(target);
		volItem['value'] = vol;
	};
	document['updateVolume'] = () => {
		const val = volItem['value'];
		setVolume(val);
	};
	volItem['value'] = vol;
	setPlayerVol();
});

// ANCHOR Initialise controls
const initControls = () => {
	document['%progressId%'] = document.getElementById('%progressId%');
	document['%PlayId%'] = document.getElementById('%PlayId%');
	const updateSvg = () => {
		document['playsvg'] = document.getElementById('playsvg');
		if (document['playsvg'] == null) {
			document['playsvg'] = document['%PlayId%'].firstChild.firstChild;
		}
		// if (!document['%playerVar%'].paused)
		// 	document['%PlayId%'].innerHTML =
		// 		document.getElementById('PauseSVG').innerHTML;
		// else
		// 	document['%PlayId%'].innerHTML =
		// 		document.getElementById('PlaySVG').innerHTML;
		if (document['%playerVar%'].paused)
			document['playsvg'].setAttribute(
				'd',
				'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z'
			);
		else
			document['playsvg'].setAttribute(
				'd',
				'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z'
			);
	};
	let interval;
	const play = () => {
		document['%playerVar%'].play();
		interval = setInterval(document['updateBar'], 20);
	};
	const pause = () => {
		document['%playerVar%'].pause();
		if (interval) clearInterval(interval);
	};
	document['%playFunc%'] = () => {
		if (document['%playerVar%'].paused) play();
		else pause();
		updateSvg();
	};
	document['play'] = play;
	document['pause'] = pause;

	play();
	updateSvg();
};

initHover(2.5e3);
initControls();

// FUNCTION Seek
const seek = (time: number) => (document['%playerVar%'].currentTime += time);

// CLASS Keybind
class Keybind {
	key: string;
	callback: () => any;
	constructor(key: string, callback: () => any) {
		this.key = key.toLowerCase();
		this.callback = callback;
	}
}
// CLASS Keymap
class Keymap {
	/**
	 * @internal
	 * @private
	 */
	_keymap: Keybind[] = [];
	set(keyBind: Keybind) {
		this._keymap.push(keyBind);
	}
	get(keyName: string) {
		keyName = keyName.toLowerCase();
		for (const i in this._keymap) {
			if (Object.prototype.hasOwnProperty.call(this._keymap, i)) {
				const keybind = this._keymap[i];
				if (keybind.key === keyName) {
					return keybind;
				}
			}
		}
		// if (isDebug) console.warn('KEYBIND DOES NOT EXIST');
		return 'KeybindDoesNotExist';
	}
}

// SECTION Time Display
document.addEventListener('DOMContentLoaded', () => {
	// ANCHOR Time Element
	const time = document.getElementById('time');
	const player = document['%playerVar%'];
	// ANCHOR format
	const format = (time: number) => {
		const x = (a: number | string) => {
			a = a.toString();
			if (a.length === 1) return `0${a}`;
			else return a;
		};
		time = Math.floor(time);
		return x((time - (time % 60)) / 60) + ':' + x(time - (time - (time % 60)));
	};
	// ANCHOR interval
	const setText = (s: string) => {
		if (time.innerText !== s) time.innerText = s;
	};
	// inefficient asf but idc
	setInterval(() => {
		setText(format(player['currentTime']) + ' / ' + format(player['duration']));
	}, 1000);
});
// !SECTION

// SECTION Keybinds
(() => {
	// ANCHOR Create Keymap
	const keymap = new Keymap();
	document['keyMap'] = keymap;

	// ANCHOR Keybindings
	keymap.set(new Keybind('ArrowUp', () => document['changeVolume'](0.1)));
	keymap.set(new Keybind('ArrowDown', () => document['changeVolume'](-0.1)));

	keymap.set(new Keybind('ArrowLeft', () => seek(-5)));
	keymap.set(new Keybind('ArrowRight', () => seek(5)));
	keymap.set(new Keybind(' ', document['%playFunc%']));

	// ANCHOR Register Event
	document.addEventListener('keydown', ({ key }) => {
		const keybind = keymap.get(key);
		if (isDebug)
			console.log('[Keybind Debug] Key Pressed:', key, '- Keybind:', keybind);
		if (keybind == 'KeybindDoesNotExist') return;
		keybind.callback();
	});
})();
// !SECTION

// ANCHOR Ready
if (
	isDebug &&
	typeof performance !== 'undefined' &&
	typeof performance.now !== 'undefined'
) {
	console.log(
		'[' +
			new Date().toLocaleTimeString() +
			'] Ready! (Took ' +
			(performance.now() - start) +
			'ms)'
	);
}
