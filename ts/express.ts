import * as e from 'express';
import * as path from 'path';
import generate from './getHtml';

const p = 6794;

const app = e();

app.use('/svg/', e.static(path.resolve('svg/')));

app.get('/player/', (req, res, next) => {
	res.send(generate(req.path.replace('/', '').replace('player/', '/')));
	next();
});

app.get('/*', (req, res) => {
	res.send(generate(req.path.replace('/', '')));
});

app.listen(p, () => {
	console.log('Listening on port', p);
});
