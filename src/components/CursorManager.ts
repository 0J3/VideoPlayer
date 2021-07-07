console.log('Loading CursorManager');

export class CursorMan {
	timeout: number = 5000;
	v: number = this.timeout;
	isHidden: boolean = false;

	ShowCursor: () => any = () => {};
	HideCursor: () => any = () => {};

	constructor(i: number) {
		this.InternalShowCursor();
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
		this.isHidden = false;
		this.ShowCursor();
		document.body.setAttribute('data-isHidden', 'false');
		console.log('Showing Cursor');
	}
	InternalHideCursor() {
		this.isHidden = true;
		this.HideCursor();
		document.body.setAttribute('data-isHidden', 'true');
		console.log('Hiding Cursor');
	}
	Move() {
		this.v = this.timeout;
	}

	registerListeners() {
		console.log('Registering Event Listeners');

		document.body.addEventListener('keydown', () => this.Move());
		document.body.addEventListener('keyup', () => this.Move());
		document.body.addEventListener('mousemove', () => this.Move());
	}
}
export const cursorMan = new CursorMan(100);
// cursorMan.registerListeners();
export default cursorMan;
