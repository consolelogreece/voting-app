import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../actions/auth'

const HomePage = ({ isAuthenticated, logout }) => (
	<div>
		<h1>HomePage</h1>
	</div>
);

function mapStateToProps(state) {
	return {
		isAuthenticated: !!state.user.token
	}
}


export default connect(mapStateToProps, { logout } )(HomePage)