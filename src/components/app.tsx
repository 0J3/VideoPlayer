import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';
import Player from './player';

import p from '../../package.json';

const g = (s: string) => {
	return () => {
		if (typeof document !== 'undefined') document.location.replace(s);
		return (
			<p id="redir_text" class="redirText">
				Redirecting to {s}
			</p>
		);
	};
};

const App: FunctionalComponent = () => {
	return (
		<div
			id="preact_root"
			class="ComponentRoot App VideoPlayer J3VideoPlayer"
			data-Version={p.version}
			data-Version-Major={p.version.split('.')[0]}
			data-Version-Minor={p.version.split('.')[1]}
			data-Version-Patch={p.version.split('.')[2]}
			data-dev={process.env.NODE_ENV || 'development'}
		>
			<Router>
				<Route
					path="/source"
					component={g('https://github.com/0j3/VideoPlayer')}
				/>
				<Player default />
			</Router>
		</div>
	);
};

export default App;
