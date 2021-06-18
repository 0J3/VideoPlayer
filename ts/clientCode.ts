const isDebug = '%isDebug%'.toString() == 'true';

const start =
	typeof performance !== 'undefined' && typeof performance.now !== 'undefined'
		? performance.now()
		: null;

const initHover = (moveTimeout: number) => {
	document['%isHover%'] = (e: {
		parentElement: { querySelector: (arg0: string) => any };
	}) => e.parentElement.querySelector(':hover') === e;

	document['%playerVar%'] = document.getElementById('%playerid%');
	document['%sourceElId%'] = document.getElementById('%sourceElId%');
	document['%sourceElId%'].src = '%url%';
	document['%controlsid%'] = document.getElementById('%controlsid%');

	const MouseMove = () => {
		if (document['%playerVar%']) {
			document['%hovering%'] =
				document['%isHover%'](document['%playerVar%']) ||
				document['%isHover%'](document['%controlsid%']);
			if (document['%isHover%'].bool !== document['%hovering%']) {
				if (document['%hovering%']) {
					document['%playerVar%'].classList.add('%activeControls%');
					document['%controlsid%'].classList.add('%activeControls%');
					document['%playerVar%'].classList.remove('%inactiveControls%');
					document['%controlsid%'].classList.remove('%inactiveControls%');
					if (document['%moved%']) clearTimeout(document['%moved%']);

					// if (!document['%isHover%'](document['%controlsid%']))
					document['%moved%'] = setTimeout(() => {
						document['%playerVar%'].classList.remove('%activeControls%');
						document['%controlsid%'].classList.remove('%activeControls%');
						document['%playerVar%'].classList.add('%inactiveControls%');
						document['%controlsid%'].classList.add('%inactiveControls%');
						document['%moved%'] = setTimeout(() => {
							document['%isHover%'].bool = false;
						}, 500);
					}, moveTimeout);
				} else {
					document['%playerVar%'].classList.remove('%activeControls%');
					document['%controlsid%'].classList.remove('%activeControls%');
					document['%playerVar%'].classList.add('%inactiveControls%');
					document['%controlsid%'].classList.add('%inactiveControls%');
				}
				document['%isHover%'].bool = document['%hovering%'];
			}
		}
	};

	document.addEventListener('mousemove', MouseMove);

	document['%mouseMoveFunc%'] = MouseMove;
};

document['updateRange'] = true;
document['updateBar'] = () => {
	const dur = document['%playerVar%'].duration;
	const time = document['%playerVar%'].currentTime;

	if (document['updateRange']) document['%progressId%'].value = time / dur;
};
document['setProgressToRange'] = () => {
	const dur = document['%playerVar%'].duration;
	const time = document['%progressId%'].value;

	document['%playerVar%'].currentTime = time * dur;
};
const initControls = () => {
	document['%progressId%'] = document.getElementById('%progressId%');
	document['%PlayId%'] = document.getElementById('%PlayId%');
	const updateSvg = () => {
		document['playsvg'] = document.getElementById('playsvg');
		if (document['playsvg'] == null) {
			document['playsvg'] = document['%PlayId%'].firstChild.firstChild;
		}
		// if (!document['%playerVar%'].paused)
		// 	document['%PlayId%'].innerHTML =
		// 		document.getElementById('PauseSVG').innerHTML;
		// else
		// 	document['%PlayId%'].innerHTML =
		// 		document.getElementById('PlaySVG').innerHTML;
		if (document['%playerVar%'].paused)
			document['playsvg'].setAttribute(
				'd',
				'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z'
			);
		else
			document['playsvg'].setAttribute(
				'd',
				'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z'
			);
	};
	let interval;
	const play = () => {
		document['%playerVar%'].play();
		interval = setInterval(document['updateBar'], 20);
	};
	const pause = () => {
		document['%playerVar%'].pause();
		if (interval) clearInterval(interval);
	};
	document['%playFunc%'] = () => {
		if (document['%playerVar%'].paused) play();
		else pause();
		updateSvg();
	};

	play();
	updateSvg();
};

initHover(2.5e3);
initControls();

if (
	isDebug &&
	typeof performance !== 'undefined' &&
	typeof performance.now !== 'undefined'
) {
	console.log(
		'[' +
			new Date().toLocaleTimeString() +
			'] Ready! (Took ' +
			(performance.now() - start) +
			'ms)'
	);
}
