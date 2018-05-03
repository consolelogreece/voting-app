import React, { Component } from 'react';
import PollTitle from '../forms/NewPollForms/NewPollTitle'
import PollOption from '../forms/NewPollForms/NewPollOption'
import { Form, Button, Message } from 'semantic-ui-react'
import InlineError from '../messages/InlineError'

import { connect } from 'react-redux'
import { createpoll } from '../../actions/poll'



class newPoll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'title': '',
      'options': ["",""],
      errors:{}
    }
  }
  

submit(data) {
  if (this.props.isAuthenticated) {
    this.props.createpoll(data).then(() => this.props.history.push('/poll/' + this.makeUrlFriendly(this.props.username) + "/" + this.makeUrlFriendly(this.state.title)))
                               .catch((res) => {
                                  this.setState({errors:{[res.response.data.code]:res.response.data.message}})
                               })
  }
}

  checkNewOption(name, value){
     if (name === (this.state.options.length - 1)) {
        if ( value.length > 0) {
            this.addOption();
        }
     } else {
       
       if ((this.state.options.length > 2) && value === "" && name === (this.state.options.length - 2)) {
          this.removeOption();
        }
       
     }
  }
  

  handleChange(event){
        let name = event.target.name;
        const value =  event.target.value;

        switch (name) {
            case 'title':
                this.setState({'title': value});
                break;
            default: 
                name = parseInt(name, 10);
                let array = this.state.options;
                array[name] = value;
                this.setState({options: array});
                this.checkNewOption(name, value)       
        }    
  }


  makeUrlFriendly(string){

    let validatedString = string;
    validatedString =  string.replace(" " , "%20");
    validatedString = string.replace("?", "%3f")
    return validatedString
  
  }


  validateString(string){
    let validatedString = string;
    validatedString =  string.replace(/%20/g , " ");
    validatedString = string.replace(/%3f/g, "?")
    return validatedString
  }

  onSubmitClick() {
    const errors = this.validate(this.state.title, this.state.options);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.submit({
        title: this.validateString(this.state.title),
        options: this.state.options,
        token:this.props.token
      })
    }
  }

  validate(title, optionArray){
    const errors = {};

    let realOptions = [];

    optionArray.forEach((option) => {
      if (option.length > 0 && !realOptions.includes(option)) {
        realOptions.push(option);
      }
    });
    if (title.length === 0) errors.title = "You must provide a title."
    if (realOptions.length < 2) errors.options = "You must provide atleast 2 different valid options."

    return errors;
  }

  addOption(){
    let options = this.state.options;
    options.push("")
    this.setState({'options':options})
  }
  
  removeOption(){
    let options = this.state.options;
    options.pop();
    
    this.setState({'options':options})
  }
  
  
  
  render(){
    let options = [];
    for (let i = 0; i < this.state.options.length; i++) {
      options.push(
      <div key={i}>
        <label>Option {i+1}</label><br />
        <PollOption name={i} handleChange={(event) => this.handleChange(event)} text={this.state.options}/>
      </div>
      )
    }
    
    
    return (
      <div>
          <Form>
             <PollTitle error={this.state.errors.title ? this.state.errors.title : false} handleChange={(event) => this.handleChange(event)} title={this.state.title}/>
             {options}          
             {this.state.errors.options && <InlineError text={this.state.errors.options} />}
            
          </Form>
          <Button primary className="LogInButton btn btn-primary" onClick={() => this.onSubmitClick()}>Submit</Button> <br />
        
      </div>
    )  
  }
}

function mapStateToProps(state){
  return {
    isAuthenticated: !!state.user.token,
    token: state.user.token,
    username: state.user.username
  }
}

export default connect(mapStateToProps, { createpoll })(newPoll);

