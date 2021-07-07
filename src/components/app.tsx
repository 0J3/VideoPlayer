import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';
import Player from './player';

import p from '../../package.json';

import s from './scss/styles.scss';
import styleFuncGetter from './lib/styleFunc';
import { InitializeKeybinds } from './lib/KeyBindings';
import { Toast } from './lib/PreactToast';
const c = styleFuncGetter(s);

const g = (s: string) => {
	return () => {
		if (typeof document !== 'undefined') document.location.replace(s);
		return (
			<p id="redir_text" class={c('redirText')}>
				Redirecting to {s}
			</p>
		);
	};
};

const App: FunctionalComponent = () => {
	if (typeof document !== 'undefined') {
		document.documentElement.setAttribute(
			'data-isiframe',
			self === top ? 'false' : 'true'
		);

		InitializeKeybinds();
	}
	return (
		<>
			<div
				id="preact_root"
				class={c('ComponentRoot App VideoPlayer J3VideoPlayer')}
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
			<Toast id="Toast" />
		</>
	);
};

export default App;
