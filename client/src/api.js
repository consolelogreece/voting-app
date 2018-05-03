import axios from 'axios';


export default {
	user: {
		login: (credentials) => axios.post('api/signin', { credentials }).then(res => res.data.user),
		signup: (credentials) => axios.post('api/signup', { credentials }).then(res => res.data.user),
		createpoll: (data) => axios.post('/api/createpoll', { data }).then(res => res.data),
		deletepoll: (data) => axios.post('/api/deletepoll', { data }).then(res => res.data),
		viewpoll: (data) => axios.post('/api/poll/', { data }).then(res => res.data),
		mypolls: (token) => axios.post('/api/mypolls', { token }).then(res => res.data),
		votepoll: (data) => axios.post('/api/votepoll', { data }).then(res => res.data)
	}
}