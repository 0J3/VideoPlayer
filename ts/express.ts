import * as e from 'express';
import * as path from 'path';
import generate from './getHtml';

const app = e();

app.use('/svg/', e.static(path.resolve('svg/')));

app.get('/*', (req, res) => {
	res.send(generate(req.path.replace('/', '')));
});

app.listen(8080, () => {
	console.log('Listening');
});
