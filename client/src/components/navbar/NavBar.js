import React, { Component } from 'react';
import { Segment, Loader, Button, Form, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';

class NavBar extends Component {

    render(){
    	const isAuthenticated = this.props.isAuthenticated

        return(
        	<div>
	        	{ !isAuthenticated &&
	        		<Menu attached={"top"}>

		        		<Menu.Item		       
		        			content="Home"
		        			as={Link} to="/"
		        		/>

		        		<Menu.Item position={"right"}>
		        			<Menu.Item		       
			        			content="Sign up"
			        			as={Link} to="/signup"
		        			/>

		        			<Menu.Item		       
			        			content="Sign in"
			        			as={Link} to="/login"
		        			/>
		        			
		        		</Menu.Item>

	            	</Menu>
	        	}

	        	{ isAuthenticated &&
					<Menu attached={"top"}>

		        		<Menu.Item		       
		        			content="Home"
		        			as={Link} to="/"
		        		/>

		        		
		        		<Menu.Item		       
		        			content="My Polls"
		        			as={Link} to="/mypolls"
		        		/>

		        		<Menu.Item		       
		        			content="Create Polls"
		        			as={Link} to="/newpoll"
		        		/>
		        		

		        		<Menu.Item position={"right"}
		        			content="Log out"
		        			onClick={() => this.props.logout()}
		        		/>

	            	</Menu>

	        	}
        	</div>
        )
    }
 }   




function mapStateToProps(state){
    return {
        isAuthenticated: !!state.user.token,
        username:state.user.username
    }
}


export default connect(mapStateToProps, { logout })(NavBar)
