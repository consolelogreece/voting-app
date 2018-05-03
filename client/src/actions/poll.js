import { USER_CREATED_POLL } from '../types';
import api from '../api';


export const createpoll = (data) => () => {
	 return api.user.createpoll(data).then((data) => console.log("status: ", data.status, "\n", "message: ", data.message))
}


export const deletepoll = (data) => () => {
	return api.user.deletepoll(data).then((data) => console.log("status: ", data.status, "\n", "message: ", data.message))
}


export const mypolls = (token) => () => {
	return api.user.mypolls(token).then((data) => data)
}

export const viewpoll = (poll) => () => {
	return api.user.viewpoll(poll).then((data) => data)
}

export const votepoll = (data) => () => {
	return api.user.votepoll(data).then((data) => data);
}
