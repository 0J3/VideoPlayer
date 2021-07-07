import { Component, h, createRef } from 'preact';
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
	isPlaying?: boolean;
}> {
	ref = createRef();

	togglePlayback() {
		const x = this.ref.current;

		if (!x.paused) {
			x.pause();
		} else {
			x.play();
		}
		this.props.isPlaying = !x.paused;

		x.setAttribute('data-isPlaying', (!x.paused).toString());
		typeof document !== 'undefined'
			? document.body.setAttribute('data-isPlaying', (!x.paused).toString())
			: null;
	}
	componentDidMount() {
		this.togglePlayback();
		this.ref.current.addEventListener('click', () => this.togglePlayback());
		if (typeof document !== 'undefined')
			setInterval(() => {
				const x = this.ref.current;
				if (!x) return;

				x.setAttribute('data-isPlaying', (!x.paused).toString());
				document.body.setAttribute('data-isPlaying', (!x.paused).toString());

				x.setAttribute('data-isMuted', x.muted);
				document.body.setAttribute('data-isMuted', x.muted);
			}, 100);
	}
	render() {
		return (
			<div id="player" class={c('playercomponent')}>
				<video
					class={c('video')}
					id="VideoPlayerEl"
					ref={this.ref}
					data-isplaying="false"
				>
					<source src={this.props.Path} />
				</video>
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
