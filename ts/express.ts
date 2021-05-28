import * as e from 'express';
import * as path from 'path';
import * as uaParser from 'ua-parser';
import generate from './getHtml';

const app = e();

app.use('/svg/', e.static(path.resolve('svg/')));

app.get('/*', (req, res) => {
	const browser = uaParser.parseUA(req.headers['user-agent']);

	// console.log(browser);

	if (
		// prevent IE but allow Edge
		(browser.family == 'IE' && Number(browser.major) < 12) ||
		// prevent old chrome versions
		((browser.family == 'Chrome' || browser.family == 'Chrome Mobile') &&
			Number(browser.patch) &&
			Number(browser.patch) < 4000) ||
		// prevent old firefox versions
		(browser.family == 'Firefox' &&
			Number(browser.major) &&
			Number(browser.major) < 78)
	) {
		return res.send(
			'Unsupported or Outdated Browser. Try <a href="https://firefox.com">the latest Firefox</a>'
		);
	}

	res.send(generate(req.path.replace('/', ''), browser.family == 'IE'));
});

app.listen(8080, () => {
	console.log('Listening');
});
