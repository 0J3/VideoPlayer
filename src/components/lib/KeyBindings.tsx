// CLASS Internal Keybind
export class _Keybind {
	key: string;
	callback: () => any;
	constructor(key: string, callback: () => any) {
		this.key = key.toLowerCase();
		this.callback = callback;
	}
}

// CLASS Keymap
export class Keymap {
	/**
	 * @internal
	 * @private
	 */
	_keymap: _Keybind[] = [];
	set(keyBind: _Keybind) {
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

export const keymap = new Keymap();

export const InitializeKeybinds = () => {
	// ANCHOR Register Event
	document.addEventListener('keydown', e => {
		const { key } = e;
		const keybind = keymap.get(key);
		if (process.env.NODE_ENV === 'development')
			console.log('[Keybind Debug] Key Pressed:', key, '- Keybind:', keybind);
		if (keybind == 'KeybindDoesNotExist') return;
		e.preventDefault();
		keybind.callback();
	});
};

// CLASS Keybind
export default class Keybind extends _Keybind {
	constructor(key: string, callback: () => any) {
		super(key, callback);
		keymap.set(this);
	}
}
