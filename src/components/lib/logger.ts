// @ts-expect-error
window.defaultConsole = window.defaultConsole ?? window.console;
// @ts-expect-error
const console = window.defaultConsole;

const isUsingInMediaPlayer = true; // set to false **if using in your own work**

const urls: any = {
	player: 'https://goosemod.com/img/logo.jpg',
};
const colorsForLogFunc: any = {
	debug: '#001aee',
	info: '#004cff',
	log: 'rgb(0, 125, 0)',
	warn: 'rgb(125, 125, 0)',
	error: '#f00',
	group: '#0000aa',
	groupCollapsed: '#0000aa',
};

import defaultLog from './defaultLog.txt';
// const defaultLog = 'https://goosemod.com/img/logo.jpg';

const isFirefox =
	navigator.userAgent.includes('Gecko/') &&
	navigator.userAgent.includes('Firefox/');
const doImage = !!''; //!isFirefox;

const transform = '';

const getDebugFunc = (logType: string, logFunc: string) => {
	const debug = (_region: string, ...args: any[]) => {
		// yoinked from goosemod but made better
		const regionSplit = _region.split('.');
		const lt = regionSplit.shift();
		const regions = [
			// @ts-expect-error
			...(lt.toLowerCase() === 'group' ? [] : [lt]),
			logType,
			...regionSplit,
		];

		const regionStrings = regions.map((x: any) => `%c${x}%c`);
		const regionStyling = regions.reduce(
			(res: string | any[]) =>
				res.concat(
					`color: white; background-color: ${
						colorsForLogFunc[logFunc] || 'rgb(0, 150, 0)'
					}; padding: ${isFirefox ? '0 3px' : '3px'}; ${
						!isFirefox && 'border: 2px solid white;'
					} border-radius: 5px;margin-left: 2px; text-transform:${
						transform || 'none'
					}; font-weight: 800`,
					''
				),
			[]
		);

		// @ts-ignore
		console[logFunc](
			...(doImage
				? [
						`%c   ${regionStrings.join(' ')}`,
						`font-size: 15px; background-color: #2a2b2c; background-image: url(${
							urls[logType] || defaultLog.toString()
						}) no-repeat; background-size: contain; padding: 2px`,
				  ]
				: [regionStrings.join(' ')]),

			...regionStyling,

			...args
		);
	};

	return debug;
};

export const getLogger = (logType: string) => {
	const wrap = (dbf: (arg1: any, arg2?: any) => any, type: string) => {
		return (...a: any) => {
			const x = a.shift();
			if (a.length === 0) return dbf(type, x);
			else return dbf(type + '.' + x, ...a);
		};
	};
	const c = {
		toString: () => {
			// for that one person who logs the console element
			return 'CustomConsole - See https://plrv3.nora.lgbt/source';
		},
		debug: wrap(getDebugFunc(logType, 'debug'), 'DEB'),
		log: wrap(getDebugFunc(logType, 'log'), 'LOG'),
		info: wrap(getDebugFunc(logType, 'info'), 'INFO'),
		warn: wrap(getDebugFunc(logType, 'warn'), 'WARN'),
		error: wrap(getDebugFunc(logType, 'error'), 'ERROR'),
		group: wrap(getDebugFunc(logType, 'group'), 'GROUP'),
		groupCollapsed: wrap(getDebugFunc(logType, 'groupCollapsed'), 'GROUP'),
		groupEnd: console.groupEnd,
	};
	return c;
};
export default getLogger;

const c = getLogger('Logger');
try {
	c.groupEnd();
} catch (e) {}
c.group('Application Log');

const logDevInfo = () => {
	// SECTION Dev Info
	if (isUsingInMediaPlayer) c.groupCollapsed('Developer Information');
	else c.groupCollapsed(`Logger-Specific Developer Information`);

	// SECTION Logging
	c.group('Logging');
	c.log('This logger replaces the default logger with a custom one');
	c.log(
		'The custom one implements most of the console.log functions, and they all (excluding groupEnd) have the following syntax:'
	);
	c.log('Syntax', 'console.functionHere(logTag?:string, ...args: any[])');
	c.log(
		'where logTag is an optional list of period seperated "tags". The log type (functionHere) is automatically appended to this, aswell as the logInstanceName*\n*In the case of console.group(-Collapsed), this is not the case'
	);
	c.info('in these messages, that logInstanceName would be Logger');
	c.info('window.console has the `PLUGIN` logInstanceName');
	c.info(
		'If created using the window.getLogger(logInstanceName) method, it will have [PLUGIN] in front of it. To solve this, use window.getNonPluginLogger(logInstanceName) or the default export of the logger'
	);
	c.warn(
		'Note that .getLogger() is heavily encouraged for plugin developers, and .getNonPluginLogger() is encouraged for 1st-party script developers'
	);
	c.group('Extra Notices');

	c.info(
		`The Error Message 'The Web Console logging API (console.log, console.info, console.warn, console.error)` +
			` has been disabled by a script on this page.' will show up on Firefox`
	);
	c.info(
		`This is expected as this replaces said logging API with a custom logger (this one). To access the default log, use \`window.defaultConsole\``
	);
	c.groupEnd();
	c.groupEnd();
	// !SECTION

	// SECTION Credits & Related
	c.group('Credits & Related');
	if (isUsingInMediaPlayer) {
		c.info('The source is available at https://plrv3.nora.lgbt/source');
		c.info(
			'This logger can be found at https://plrv3.nora.lgbt/logger and can be used almost anywhere with minimal effort'
		);
	} else
		c.info(
			'This logger can be found at https://plrv3.nora.lgbt/logger\nCopyright (c) 2021 0J3. This logger is licensed under the MIT license'
		);
	c.groupEnd();
	// !SECTION

	c.groupEnd();
	// !SECTION
};

// @ts-ignore
if (isUsingInMediaPlayer) {
	// SECTION Expected Warnings & Developer Info
	c.groupCollapsed('Expected Warnings & Developer Info');
	// SECTION Expected Warnings
	c.groupCollapsed(`Expected Warnings/Errors`);

	// ANCHOR Logging API
	c.groupCollapsed('Logging API');
	c.info(
		`Error Message: 'The Web Console logging API (console.log, console.info, console.warn, console.error)` +
			` has been disabled by a script on this page.'`
	);
	c.info(
		`This is expected as this replaces said logging API with a custom logger (this one). To access the default log, use \`window.defaultConsole\``
	);
	c.debug(`This error isn't shown on all browsers`);
	c.groupEnd();

	// ANCHOR Autoplay
	c.groupCollapsed('Autoplay');
	c.info(
		`Error Message: 'An error has occurred while toggling playback. Error:
 DOMException: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD'`
	);
	c.info(
		`Modern browsers commonly disable autoplay by default - This error is shown as a warning as we catch the errors from .play() and emit them as warnings`
	);
	c.debug(`This error isn't shown if autoplay is allowed`);
	c.groupEnd();

	c.groupEnd();
	// !SECTION

	// ANCHOR Log Dev Info if using in media player
	logDevInfo();

	c.groupEnd();
	// !SECTION
} else {
	// ANCHOR Log Dev Info if not using in media player
	logDevInfo();
}

// ANCHOR Plugin & Devtools Compatability
// @ts-ignore
document.publicLogger = document.console = window.console = getLogger('Plugin');
// @ts-ignore
document.getNonPluginLogger = window.getNonPluginLogger = getLogger;
// @ts-ignore
document.getLogger = window.getLogger = (pluginName: string) =>
	getLogger(`[PLUGIN] ${pluginName}`);
