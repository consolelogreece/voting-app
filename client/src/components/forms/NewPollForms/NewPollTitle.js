import React, { Component } from 'react';
import { Input, Form } from 'semantic-ui-react'
import InlineError from '../../messages/InlineError'


class Title extends Component {
	constructor(){
		super();
		this.state = {
			data:{},
			style: {
				width:"100%"
			}
			
		}
	}

  render(){
    return (
    	<div error={(!!this.props.error).toString()}>
			<label htmlFor="title">Title</label><br />
			<Input style={this.state.style} type="text" id="title" name="title" placeholder="Example: What's your favorite color?" value={this.props.title} onChange={this.props.handleChange.bind(this)}/><br />
			{this.props.error && <InlineError text={this.props.error} />}
		</div>
    )  
  }
}

export default Title