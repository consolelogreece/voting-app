import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import CreatePoll from './poll/CreatePoll'
import MyPolls from './poll/MyPolls'
import DeletePoll from './poll/DeletePoll'
import ViewPoll from './poll/ViewPoll'
import VotePoll from './poll/VotePoll'

import dotenv from 'dotenv'

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "client", "build")))

app.post('/api/poll/*', (req, res) => {
	const data = req.body.data
	ViewPoll(data, res)
})


app.post('/api/signin', (req, res) => {
	const credentials  = req.body.credentials
	SignIn(credentials, res);
});

app.post('/api/signup', (req, res) => {
	const credentials = req.body.credentials
	SignUp(credentials, res);
});

app.post('/api/createpoll', (req, res) => {
	const data = req.body.data;
	CreatePoll(data, res);
});

app.post('/api/votepoll', (req, res) => {

	const data = req.body.data;
	VotePoll(data, res)
	
});

app.post('/api/mypolls', (req, res) => {
	const data = req.body.token;
	MyPolls(data, res)	
});

app.post('/api/deletepoll', (req, res) => {
	const data = req.body.data;
	DeletePoll(data, res)
	
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, "client", "build", "index.html"))
})


app.listen(process.env.PORT || 80, () => console.log("Running on port " + process.env.PORT))
