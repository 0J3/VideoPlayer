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

const statuses = [
	100,
	101,
	102,
	103,
	200,
	201,
	202,
	203,
	204,
	205,
	206,
	207,
	208,
	218, // apache only
	226,
	300,
	301,
	302,
	303,
	304,
	305,
	306,
	307,
	308,
	400,
	401,
	402,
	403,
	404,
	405,
	406,
	407,
	408,
	409,
	410,
	411,
	412,
	413,
	414,
	415,
	416,
	417,
	418,
	420, // twitter api v1 version of 429
	421,
	422,
	423,
	424,
	425,
	428,
	429,
	430, // shopify version of 429
	431,
	444, // nginx no response
	451,
	494, // nginx request header too large
	495, // nginx ssl cert error
	496, // nginx ssl cert required
	497, // nginx http sent to https port
	499, // nginx client closed request
	500,
	501,
	502,
	503,
	504,
	505,
	506,
	507,
	508,
	510,
	511,
	520, // cloudflare webserver returned unknown error
	521, // cloudflare webserver is down
	522, // cloudflare timeout
	523, // cloudflare origin unreachable
	524, // cloudflare timeout
	525, // cloudflare ssl handshake failure
	526, // cloudflare invalid ssl cert
	527, // cloudflare railgun error
	530, // cloudflare returned alongside 1xxx error
];

let statusHtml = '';
statuses.forEach(s => {
	statusHtml += `<a href="/status/${s}/">${s}</a><br/>`;
});

app.get('/status/:status', (req, res, next) => {
	if (
		req.params.status &&
		Number(req.params.status) &&
		statuses.includes(Number(req.params.status))
	)
		res.status(Number(req.params.status)).send();
	else
		res
			.status(400)
			.send(`Please specify a status. Valid Status codes are: ${statusHtml}`);
	return;
});

app.get('/*', (req, res) => {
	res.send(generate(req.path.replace('/', '')));
});

app.listen(p, () => {
	console.log('Listening on port', p);
});
