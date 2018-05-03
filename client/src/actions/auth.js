import { USER_LOGGED_IN, USER_SIGNED_UP, USER_LOGGED_OUT } from '../types';
import api from '../api';

export const userLoggedIn = (user) => ({
	type: USER_LOGGED_IN,
	user
})

export const login = (credentials) => (dispatch) => {
	 return api.user.login(credentials)
		.then(user => {
			localStorage.votingappJWT = user.token;
			localStorage.votingappUsername = user.username;
			dispatch(userLoggedIn(user));
		});
}


export const userLoggedOut = () => ({
	type:USER_LOGGED_OUT
});



export const logout = () => dispatch => {
	localStorage.removeItem("votingappJWT")
	dispatch(userLoggedOut())
}



export const userSignedUp = (user) => ({
	type: USER_SIGNED_UP,
	user
})



export const signup = credentials => (dispatch) =>
	api.user.signup(credentials)
		.then(user => dispatch(userSignedUp(user)));





