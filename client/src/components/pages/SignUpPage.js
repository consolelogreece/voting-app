import React from 'react';
import SignUpForm from '../forms/SignUpForm'
import { connect } from 'react-redux'
import { signup } from '../../actions/auth'

class SignUpPage extends React.Component {
	state={};

	submit = data => this.props.signup(data).then(() => this.props.history.push('/'));

	render(){
		return(
			<div>
				<h1>Signup Page</h1>

				<SignUpForm submit={this.submit} />
			</div>
		)
	}
}

export default connect(null, { signup })(SignUpPage);