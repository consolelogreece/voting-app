import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router} from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import rootReducer from './rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension'

import { userLoggedIn } from './actions/auth' 

import App from './App';
import "semantic-ui-css/semantic.min.css"


const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

if (localStorage.votingappJWT) {
	const user = { token: localStorage.votingappJWT, username: localStorage.votingappUsername };
	store.dispatch(userLoggedIn(user));
}

ReactDOM.render(
	<Router>
		<Provider store={store}>
			<App />
		</Provider>
	</Router>,
	 document.getElementById('root'));
registerServiceWorker();
