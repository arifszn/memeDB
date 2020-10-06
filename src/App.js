import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './assets/css/App.scss';
import Error from './components/Error';
import withTracker from './components/withTracker';
import Page from './components/Page';

function App() {

	return (
		<div>
			<BrowserRouter>
				<Switch>
					<Route exact path="/"  component={withTracker(Page)} />
					<Route exact path="/wallpaper"  component={withTracker(Page)} />
					<Route component={Error} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
