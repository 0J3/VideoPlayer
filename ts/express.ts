import * as e from 'express';
import * as path from 'path';
import * as uaParser from 'ua-parser';
import generate from './getHtml';

const app = e();

app.use('/svg/', e.static(path.resolve('svg/')));

app.get('/*', (req, res) => {
	const browser = uaParser.parseUA(req.headers['user-agent']);

	// console.log(browser);

	res.send(generate(req.path.replace('/', ''), browser.family == 'IE'));
});

app.listen(8080, () => {
	console.log('Listening');
});
