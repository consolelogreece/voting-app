import React from 'react';
import { Form, Button, Message } from 'semantic-ui-react'
import Validator from 'validator'
import InlineError from '../messages/InlineError'

class LoginForm extends React.Component {

	state = {
		data: {
			email:'',
			username:'',
			password:'',
			confirmPassword:''
		},
		loading:false,
		errors: {}
	}

	onChange = e => 
		this.setState({
			data:{...this.state.data, [e.target.name]: e.target.value}
		});

	
	onSubmit = () => {
		const errors = this.validate(this.state.data)
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({loading:true})
			this.props
				.submit(this.state.data)
				.catch(err => this.setState({errors:err.response.data.errors, loading:false}))
		}
	}


	validate = (data) => {
		const errors = {};
		if (!data.password) errors.password = "Please enter password";
		if (data.confirmPassword !== data.password) errors.confirmPassword = "Passwords don't match";
		if (!data.confirmPassword) errors.confirmPassword = "Confirm your password";
		if (!data.username) errors.username = "Please enter a username";
		if (!Validator.isEmail(data.email)) errors.email = "Invalid email";
		return errors;	
	}


	render() {
		const { data, errors, loading } = this.state;

		return (
			<div>
				<Form onSubmit={this.onSubmit} loading={ loading }>
					{ errors.global && ( 
						<Message negative>
							<Message.Header>
								Oops!
							</Message.Header>
							<p>
								{ errors.global }
							</p>
						</Message>
					)}

					<Form.Field error={!!errors.username}>
						<label htmlFor="username">Username</label>
						<input type="text" id="username" name="username" placeholder="Username" value={data.username} onChange={this.onChange}/>
						{errors.username && <InlineError text={errors.username} />}
					</Form.Field>


					<Form.Field error={!!errors.email}>
						<label htmlFor="email">Email</label>
						<input type="text" id="email" name="email" placeholder="example@example.com" value={data.email} onChange={this.onChange}/>
						{errors.email && <InlineError text={errors.email} />}
					</Form.Field>


					<Form.Field error={!!errors.password}>
						<label htmlFor="email">Password</label>
						<input type="password" id="password" name="password" placeholder="password" value={data.password} onChange={this.onChange}/>
						{errors.password && <InlineError text={errors.password} />}
					</Form.Field>


					<Form.Field error={!!errors.confirmPassword}>
						<label htmlFor="confirmPassword">Confirm password</label>
						<input type="Password" id="confirmPassword" name="confirmPassword" placeholder="example@example.com" value={data.confirmPassword} onChange={this.onChange}/>
						{errors.confirmPassword && <InlineError text={errors.confirmPassword} />}
					</Form.Field>


					<Button primary>Sign up</Button>

				</Form>
			</div>
		);
	}
}

export default LoginForm;