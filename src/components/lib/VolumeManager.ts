export default (
	url: string,
	volItem: any,
	volUpdate: (volume: number) => any
) => {
	const maxVol = 2;
	const lsVol =
		localStorage.getItem('Volume-' + url) || localStorage.getItem('Volume');
	let vol: number = Number(typeof lsVol === 'undefined' ? 1 : lsVol);
	const setPlayerVol = () => {
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
	};
};
