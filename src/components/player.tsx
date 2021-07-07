import { Component, h, createRef, RefObject } from 'preact';
import get from './lib/getUrl';

import Cursor from './lib/CursorManager';
Cursor.registerListeners();

import Keybind from './lib/KeyBindings';
import VolMgrGetter from './lib/VolumeManager';
import s from './scss/styles.scss';
import styleFuncGetter from './lib/styleFunc';
import ToastMgr from './lib/PreactToast';
const c = styleFuncGetter(s);

interface Funcs {}

const VolSlider = (
	<input
		type="range"
		min="0"
		max="1"
		value="0"
		step="0.001"
		class={c('slider volume')}
		id="volume"
	/>
);

// SECTION Controls
class Controls extends Component<{
	Funcs: Funcs;
	Video: RefObject<any>;
}> {
	progress = createRef();
	componentWillMount() {
		setInterval(() => {
			this.progress.current.value =
				this.props.Video.current.currentTime /
				this.props.Video.current.duration;
		}, 10);
	}
	render() {
		return (
			<div id="controls" class={c('controls')}>
				{/* ANCHOR Progress */}
				<input
					type="range"
					min="0"
					max="1"
					value="0"
					step="0.001"
					class={c('slider volume')}
					id="progress"
					onInput={() => {
						const v = this.progress.current.value;
						this.props.Video.current.currentTime =
							v * this.props.Video.current.duration;
					}}
					ref={this.progress}
				/>
			</div>
		);
	}
}
// !SECTION

// SECTION Player
export class Player extends Component<{
	Path: string;
	isPlaying?: boolean;
}> {
	isFirstMount = true;
	ref = createRef();
	volmgr: any;

	PlaybackToggleEvent: CustomEvent | undefined;

	// ANCHOR Toggle Playback
	togglePlayback() {
		const x = this.ref.current;

		if (!x.paused) {
			x.pause();
			typeof document !== 'undefined'
				? document.body.setAttribute('data-isPlaying', 'false')
				: null;
			x.setAttribute('data-isPlaying', 'false');
		} else {
			x.play();
			typeof document !== 'undefined'
				? document.body.setAttribute('data-isPlaying', 'true')
				: null;
			x.setAttribute('data-isPlaying', 'true');
		}
		this.props.isPlaying = !x.paused;
	}
	// ANCHOR Component Mounted
	componentDidMount() {
		try {
			setTimeout(() => this.togglePlayback(), 1);
		} catch (error) {}
		this.ref.current.addEventListener('click', () => this.togglePlayback());
		if (typeof document !== 'undefined')
			setInterval(() => {
				// ANCHOR Play/Pause
				new Keybind(' ', () => this.togglePlayback());
				// ANCHOR Mute/Playing Status
				const x = this.ref.current;
				if (!x) return;

				if (x.getAttribute('data-isPlaying') !== (!x.paused).toString()) {
					x.setAttribute('data-isPlaying', (!x.paused).toString());
					document.body.setAttribute('data-isPlaying', (!x.paused).toString());
				}
				if (x.getAttribute('data-isMuted') !== (!x.muted).toString()) {
					x.setAttribute('data-isMuted', (!x.muted).toString());
					document.body.setAttribute('data-isMuted', (!x.muted).toString());
				}
			}, 100);
		if (this.isFirstMount === true) {
			this.PlaybackToggleEvent = new CustomEvent('PlaybackToggled', {
				detail: {},
				bubbles: true,
				cancelable: false,
				composed: true,
			});
			this.isFirstMount = false;
			if (typeof document !== 'undefined') {
				const x = this.ref.current;
				if (!x) return;

				x.playbackRate = localStorage.getItem('PlaybackRate') || 1;

				let frameTime = 0;
				// SECTION Keybinds
				// ANCHOR Play/Pause
				new Keybind(' ', () => this.togglePlayback());
				new Keybind('k', () => this.togglePlayback());

				// ANCHOR Mute/Unmute
				new Keybind('m', () => (x.muted = !x.muted));

				// ANCHOR Skip forwards/backwards 10s
				new Keybind('j', () => (x.currentTime = x.currentTime - 10));
				new Keybind('l', () => (x.currentTime = x.currentTime + 10));

				// ANCHOR Skip forwards/backwards 5s
				new Keybind('arrowleft', () => {
					x.currentTime = x.currentTime - 5;
				});
				new Keybind('arrowright', () => (x.currentTime = x.currentTime + 5));

				// ANCHOR Skip forwards/backwards 1 frame (beware: errors on non-firefox)
				new Keybind(',', () => {
					if (!frameTime) {
						let i = x.currentTime;
						x.seekToNextFrame();
						setTimeout(() => {
							frameTime = x.currentTime - i;
							console.log(x.currentTime, i);
							x.currentTime = i - frameTime;
						}, 1);
					} else {
						x.currentTime = x.currentTime - frameTime;
					}
				});
				new Keybind('.', () => x.seekToNextFrame());

				// ANCHOR Volume
				new Keybind('arrowup', () => this.volmgr.changeVolume(0.1));
				new Keybind('arrowdown', () => this.volmgr.changeVolume(-0.1));

				// ANCHOR Le speed
				new Keybind('[', () => {
					x.playbackRate += -0.125;
					localStorage.setItem('PlaybackRate', x.playbackRate);
					ToastMgr.Show('Toast', `Speed: ${x.playbackRate * 100}%`);
				});
				new Keybind(']', () => {
					x.playbackRate += 0.125;
					localStorage.setItem('PlaybackRate', x.playbackRate);
					ToastMgr.Show('Toast', `Speed: ${x.playbackRate * 100}%`);
				});

				// !SECTION
			}
		}
	}
	// ANCHOR Render
	render() {
		const trim = (s: string) => {
			return s;
		};

		this.volmgr = VolMgrGetter(trim(this.props.Path), VolSlider, () => {});
		return (
			<div id="player" class={c('playercomponent')}>
				<video
					class={c('video')}
					id="VideoPlayerEl"
					ref={this.ref}
					data-isplaying="false"
					loop={Boolean(localStorage.getItem('isLooped') ?? 'true')}
				>
					<source src={this.props.Path} />
					<source src={this.props.Path + '.mp4'} />
					<source src={this.props.Path + '.webm'} />
				</video>
				<Controls Funcs={{}} Video={this.ref} />
			</div>
		);
	}
}
// !SECTION

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
