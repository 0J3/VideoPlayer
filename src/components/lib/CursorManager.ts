import getConsole from './logger';
const console = getConsole('CursorManager');
console.debug('Init', 'Loading CursorManager');

export class CursorMan {
	timeout: number = 5000;
	v: number = this.timeout;
	isHidden: boolean = false;

	ShowCursor: () => any = () => {};
	HideCursor: () => any = () => {};

	constructor(i: number) {
		this.InternalShowCursor();
		if (typeof document !== 'undefined')
			setInterval(() => {
				this.v = this.v - i;
				if (this.v < 0) {
					this.v = 0;
					if (!this.isHidden) this.InternalHideCursor();
				} else {
					if (this.isHidden) this.InternalShowCursor();
				}
			}, i);
	}
	InternalShowCursor() {
		if (typeof document !== 'undefined') {
			this.isHidden = false;
			this.ShowCursor();
			document.body.setAttribute('data-isHidden', 'false');
			console.debug('Cursor', 'Showing Cursor');
		}
	}
	InternalHideCursor() {
		if (typeof document !== 'undefined') {
			this.isHidden = true;
			this.HideCursor();
			document.body.setAttribute('data-isHidden', 'true');
			console.debug('Cursor', 'Hiding Cursor');
		}
	}
	Move() {
		this.v = this.timeout;
	}

	registerListeners() {
		if (typeof document !== 'undefined') {
			console.info('Init.registerEvents', 'Registering Event Listeners');

			document.body.addEventListener('keydown', () => this.Move());
			document.body.addEventListener('keyup', () => this.Move());
			document.body.addEventListener('mousemove', () => this.Move());
		}
	}
}
export const cursorMan = new CursorMan(100);
// cursorMan.registerListeners();
export default cursorMan;

console.debug('Init', 'Loaded CursorManager');
