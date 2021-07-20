import getConsole from './lib/logger';
const console = getConsole('Player');
console.debug('Init', 'Loading Player');

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

const refVolSlider = createRef();
const VolSlider = (
	<input
		type="range"
		min="0"
		max="1"
		value="0"
		step="0.001"
		class={c('slider volume')}
		id="volume"
		ref={refVolSlider}
	/>
);

console.groupCollapsed('Init', 'Initialize Classes');
// SECTION Controls
class Controls extends Component<{
	Funcs: Funcs;
	Video: RefObject<any>;
}> {
	progress = createRef();
	componentWillMount() {
		setInterval(() => {
			if (this.props.Video.current)
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
					class={c('slider progress')}
					id="progress"
					onInput={() => {
						try {
							const v = this.progress.current.value;
							this.props.Video.current.currentTime =
								v * this.props.Video.current.duration;
						} catch (error) {
							console.error(error);
						}
					}}
					ref={this.progress}
				/>
				{VolSlider}
			</div>
		);
	}
}
// !SECTION
console.log('Created Component Class');

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
			x.play()
				.then(() => {
					typeof document !== 'undefined'
						? document.body.setAttribute('data-isPlaying', 'true')
						: null;
					x.setAttribute('data-isPlaying', 'true');
				})
				.catch((error: any) => {
					console.warn(
						'TogglePlayback',
						'An error has occurred while toggling playback. Error:\n',
						error
					);
				});
		}
		this.props.isPlaying = !x.paused;
	}
	// ANCHOR Component Mounted
	componentDidMount() {
		try {
			setTimeout(() => this.togglePlayback(), 1);
		} catch (error) {}
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
	// ANCHOR updateVolume
	updateVolume(x: number) {
		try {
			if (this.ref.current) this.ref.current.volume = x;
			else setTimeout(() => this.updateVolume(x), 100);
		} catch (error) {
			console.error('VolumeUpdateError:', error);
		}
	}
	// ANCHOR initVolMgr
	initVolMgr() {
		if (this.ref.current) {
			// if there is a video player

			// init the volume manager
			this.volmgr = VolMgrGetter(
				this.ref.current.currentSrc ?? this.props.Path,
				refVolSlider,
				(x: number) => this.updateVolume(x)
			);

			// onload, set the URL
			this.ref.current.addEventListener(
				'loadeddata',
				() => {
					console.log('loaded');
					this.volmgr.setURL(this.ref.current.currentSrc);
				},
				false
			);
			this.volmgr.updateVolFromStorage();
		} // otherwise, repeat in 100ms
		else setTimeout(() => this.initVolMgr(), 100);
	}
	// ANCHOR Render
	render() {
		this.initVolMgr();
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
				<div class={c('executeClick')} onClick={() => this.togglePlayback()} />
				<Controls Funcs={{}} Video={this.ref} />
			</div>
		);
	}
}
console.log('Created Player Class');
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
console.log('Created PlayerWrapper Class');
console.groupEnd();
console.debug('Init', 'Loaded Player');
