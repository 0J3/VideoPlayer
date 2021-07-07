import { Component, h } from 'preact';
import get from './getUrl';

import Cursor from './CursorManager';
Cursor.registerListeners();

import styles from './styles.scss';
const c = (a: string) => {
	let b = a.split(' ').map((b: string) => {
		return `c_${b} ${'ClassNotFoundInStylesheet'}`;
	});
	console.log(b);

	return b;
};

interface Funcs {}

class Controls extends Component<{
	Funcs: Funcs;
}> {
	render() {
		return <div id="controls" class="controls"></div>;
	}
}

export class Player extends Component<{
	Path: string;
}> {
	render() {
		return <div></div>;
	}
}

export default class PlayerWrapper extends Component {
	render() {
		if (typeof document === 'undefined')
			return (
				<p id="loadingText" class={c('loadingText')}>
					Loading Application
				</p>
			);
		const url = get(document.location.pathname);
		return <Player Path={url} />;
	}
}
