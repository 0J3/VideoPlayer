import * as fs from 'fs';
import * as minifier from 'html-minifier';
import * as uglifyjs from 'uglify-js';
import { optimize } from 'svgo';
import { gen } from './UUID';
import { URL } from 'url';
import { resolve } from 'path';

const debugMode = true;

const svgDir = resolve('svg/');

const minify = debugMode
	? (v: string) => {
			return v;
	  }
	: minifier.minify;

const minifyOptions: minifier.Options = {
	removeAttributeQuotes: true,
	html5: true,
	removeOptionalTags: false,
	removeEmptyElements: false,
	removeComments: true,
	removeRedundantAttributes: true,
	removeEmptyAttributes: false,
	removeScriptTypeAttributes: true,
	removeTagWhitespace: false, //true,
	removeStyleLinkTypeAttributes: true,
	collapseWhitespace: true,
	minifyCSS: true,
	minifyJS: true,
	quoteCharacter: `'`,
	keepClosingSlash: false,
};

const uglify = (s: string) => {
	return debugMode ? s : uglifyjs.minify(s).code;
};
const minifysvg = (s: string) => {
	return debugMode
		? s
		: optimize(s, {
				multipass: true,
		  }).data;
};

const template = fs.readFileSync('./othersrc/template.html').toString();

const base = 'https://github.com/0J3/random/raw/main/';

const uids = [];

export const generateWithArgs = (args: { [x: string]: any }) => {
	let html: string = template;
	for (const key in args) {
		if (Object.prototype.hasOwnProperty.call(args, key)) {
			const element = args[key];
			html = html
				.split('VAR_' + key)
				.join(`%${key}%`)
				.split(`%${key}%`)
				.join(element);
		}
	}
	return html;
};
export const getUrl = (
	path: string = 'https://0j3.github.io/random/hri.mp4'
) => {
	// if (path == '' || !path) {
	// 	path = document.location.hash.replace('#', '');
	// }

	if (path.startsWith('//')) {
		path = path.replace('//', 'https://');
	} else if (path.startsWith('/')) {
		path = new URL(path.replace('/', ''), base).toString();
	} else if (path == '' || !path) {
		path = 'https://0j3.github.io/random/hri.mp4';
	}

	if (!path.startsWith('https')) {
		if (path.startsWith('http://')) {
			path = path.replace('http://', 'https://');
		} else if (path.startsWith('//')) {
			path = 'https:' + path;
		} else if (path.split('/')[0].includes('.') && path.split('/').length > 1) {
			path = 'https://' + path;
		} else {
			path = base + '/' + path;
		}
	}

	return path;
};
export const generateUnique = name => {
	if (debugMode) return name;
	const uid = name + '_' + gen().split('-').join('');

	if (uids.includes(uid)) {
		return generateUnique(name);
	} else {
		uids[uids.length] = uid;

		return uid;
	}
};

let svgs = {};

fs.readdirSync(svgDir).forEach(v => {
	svgs[v] = minifysvg(fs.readFileSync(resolve(svgDir, v)).toString());
});

const clientCode = uglify(fs.readFileSync('./js/clientCode.js').toString());
const css = fs.readFileSync('./othersrc/css/css.css').toString();
const ie11css = fs.readFileSync('./othersrc/css/ie11css.css').toString();

export default (path: string = '', isIe: boolean = false) => {
	const playerVar = generateUnique('playerVar');
	const playerid = generateUnique('PlayerID');
	const controlsid = generateUnique('ControlsID');
	const url = getUrl(path);
	const script = clientCode;

	const sourceElId = generateUnique('sourceElId');
	const moved = generateUnique('Moved');
	const hovering = generateUnique('Hovering');
	const isHover = generateUnique('IsHover');
	const activeControls = generateUnique('ActiveControls');
	const inactiveControls = generateUnique('InactiveControls');
	const playFunc = generateUnique('playFunc');
	const pauseFunc = generateUnique('pauseFunc');
	const mouseMoveFunc = generateUnique('mouseMoveFunc');
	const PlayId = generateUnique('PlayId');
	const progressId = generateUnique('progressId');
	const volumeId = generateUnique('volumeId');

	let style = css;

	if (isIe) {
		style = ie11css;
	}
	return minify(
		generateWithArgs({
			script: `<script>${script}</script>`,
			style: `<style>${style}</style>`,
			url,
			playerVar,
			playerid,
			controlsid,
			sourceElId,
			moved,
			hovering,
			isHover,
			activeControls,
			inactiveControls,
			playFunc,
			pauseFunc,
			mouseMoveFunc,
			PlayId,
			progressId,
			volumeId,
			isDebug: debugMode,
			...svgs,
		}),
		minifyOptions
	);
};
