import { Component, h } from 'preact';
import get from './getUrl';

import Cursor from './CursorManager';
Cursor.registerListeners();

import s from './styles.scss';
import styleFuncGetter from './styleFunc';
const c = styleFuncGetter(s);

interface Funcs {}

class Controls extends Component<{
	Funcs: Funcs;
}> {
	render() {
		return <div id="controls" class={c('controls')}></div>;
	}
}

export class Player extends Component<{
	Path: string;
}> {
	render() {
		return (
			<div id="player" class={c('playercomponent')}>
				<Controls Funcs={{}} />
			</div>
		);
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
