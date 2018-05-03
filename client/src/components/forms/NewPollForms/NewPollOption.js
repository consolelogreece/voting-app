import React, { Component } from 'react';
import { Input } from 'semantic-ui-react'

class Option extends Component {
constructor(){
        super();
        this.state = {
            style: {
                width:"100%"
            }
            
        }
    }

  render(){
    return (

        <div>

            <Input style={this.state.style} type="text" autoComplete="goAwayChromeAutocompleteWarnings>:("

            name={this.props.name} key={this.props.name}

            value={this.props.text[this.props.name]}

            onChange={(event) => this.props.handleChange(event)}/><br />

        </div>
    );
  }
}

export default Option
