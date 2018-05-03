import React from 'react';
import LoginForm from '../forms/LoginForm'
import { connect } from 'react-redux'
import { login } from '../../actions/auth'


class LoginPage extends React.Component {
	state={};

	submit = data => this.props.login(data).then(() => this.props.history.push('/'));
	


	
	render(){
		return(
			<div>
				<h1>Login Page</h1>

				<LoginForm submit={this.submit}/>
			</div>
		)
	}
};

export default connect(null, { login })(LoginPage);