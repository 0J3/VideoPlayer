const base = 'https://github.com/0J3/random/raw/main/';
export default (path: string = `${base}hri.mp4`) => {
	// if (path == '' || !path) {
	// 	path = document.location.hash.replace('#', '');
	// }

	if (path.startsWith('//')) {
		path = path.replace('//', 'https://');
	} else if (path.startsWith('/')) {
		path = path.replace('/', '');
	}

	if (path === '' || !path || path === '/') {
		path = `${base}hri.mp4`;
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
