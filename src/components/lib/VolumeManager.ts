import getConsole from './logger';
const console = getConsole('VolumeManager');
console.debug('Init', 'Loading VolumeManager');

import { RefObject } from 'preact';

export const Module = (
	url: string,
	volItemRef: RefObject<any>,
	volUpdate: (volume: number) => any
) => {
	const volItem = volItemRef.current;
	const maxVol = 2;
	let vol: number = 1;

	const checkVol = () => {
		if (!isFinite(vol / maxVol)) {
			console.warn(
				`Volume is not finite (${vol}/${maxVol}) - Setting vol to ${maxVol}`
			);
			vol = maxVol;
		}
	};

	const updateVolFromStorage = () => {
		const lsVol =
			localStorage.getItem('Volume-' + url) || localStorage.getItem('Volume');
		vol = Number(typeof lsVol === 'undefined' ? 1 : lsVol);
	};

	const setPlayerVol = () => {
		checkVol();
		volUpdate(vol / maxVol);
	};
	const setVolume = (volume: number) => {
		if (volume > 2)
			throw new Error('Volume ' + vol + ' is > max volume of ' + maxVol);
		if (volume < 0) throw new Error('Volume ' + vol + ' is < min volume of 0');
		localStorage.setItem('Volume', volume.toString());
		localStorage.setItem('Volume-' + url, volume.toString());
		vol = volume;
		setPlayerVol();
	};
	const changeVolume = (volume: number) => {
		const target = Math.min(Math.max(vol + volume, 0), 2);

		setVolume(target);
		volItem['value'] = vol;
	};
	const updateVolume = () => {
		const val = volItem['value'];
		setVolume(val);
	};
	volItem['value'] = vol;
	setPlayerVol();

	const getVolume = () => vol / maxVol;

	volItem.addEventListener('input', () => updateVolume());
	return {
		setVolume,
		getVolume,
		set volume(v: number) {
			setVolume(v);
		},
		get volume(): number {
			return getVolume();
		},
		changeVolume,
		updateVolume,
		updateVolFromStorage,
		setURL: (a?: string) => {
			if (a && a !== url) {
				url = a;
				updateVolFromStorage();
				volItem['value'] = vol;
				volUpdate(vol);
			}
		},
	};
};
export default Module;

console.info('Init', 'Loaded VolumeManager');
