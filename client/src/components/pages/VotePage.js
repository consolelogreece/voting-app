import React, { Component } from 'react';
import { Segment, Loader, Button, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { viewpoll, votepoll } from '../../actions/poll';
import VotePieChart from '../charts/VotePieChart';
import InlineError from '../messages/InlineError'

class VotePage extends Component {
constructor(){
        super();
        this.state = {
            title:'',
            options:[],
            customOption: "",
            errors:{},
            hasVoted:false,
            loading:true,
            voting: true
        }
    }

    componentDidMount(){
        this.props.viewpoll({poll:this.props.history.location.pathname, username: this.props.username}).then(response => {

            if (response.voted) {
                this.setState({title: response.title, options: response.options.options, voting:false, loading:false, hasVoted:true});
            } else {
                this.setState({title: response.title, options: response.options.options, loading:false})
            }
            
        })
        .catch(response => {
            this.setState({errors:{[response.response.data.code]:response.response.data.message}})
        })

    }


    optionExists(data){

        let exists = false;
        this.state.options.forEach((option, i) => {
           
            if (option.option === data){
                exists = true;
                return;
            } 

        });

        return exists;

    }

    customVote(){
      
        let vote = this.state.customOption;

        let newOptionsArray = [...this.state.options, {option:vote, score: 1}]

        if (this.state.customOption === "" || this.optionExists(vote)) {
            alert("too short or exists");
            return;
        } else {
            
            this.setState({options: newOptionsArray, voting:false, hasVoted:true}, () => this.performVote(vote));
        }
    
    }



    predefinedVote(option){
        
       this.updateScore(option);

       this.setState({hasVoted:true}, () =>this.performVote(option));   

    }


    performVote(option){

        const votedata = {token: this.props.token, poll: this.props.history.location.pathname, vote:option}

        this.props.votepoll(votedata).then(data => {});  // callback data from server, use this data to display error messages to user etc

    }


    updateScore(option){

        let newOptionState = JSON.parse(JSON.stringify(this.state.options))
        
        const optionIndex = this.findOption(option);

        newOptionState[optionIndex].score = (newOptionState[optionIndex].score + 1)

        this.setState({options: newOptionState, voting:false})
    
        
    }


  findOption(data){
        let index = 0;
        this.state.options.forEach((option, i) => {
           
            if (option.option === data){
                index = i;

            } 

        });

        return index;
    }
    

    mapPolls(){
        let optionArray = [];

        this.state.options.forEach(option => {
            optionArray.push(
                <div key={option.option} id={option.option} name={option.option} className="ui raised segment"> 
                    <Button name={option.option} onClick={(event) => this.predefinedVote(event.target.name)} primary={true} size="large" fluid={true}> {option.option} </Button>
                </div>
            )
        })
        return optionArray;
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }



  render(){
    let optionArray = this.mapPolls();
    const { loading, errors, voting, title, options, hasVoted, customOption  } = this.state;

    return (

        <div loading={loading}>
                {
                    !!errors.noExist && <InlineError text={errors.noExist} />
                }

        {!this.state.errors.noExist &&
            <div loading={this.state.loading}>
                    <h2>{title} </h2><br />
                
                    <Segment hidden={!voting} loading= { loading }>
                        {optionArray}
                    </Segment>
            
                {(this.props.isAuthenticated && !loading && !hasVoted) &&
                <Form onSubmit={() => this.customVote()}>
                    <Form.Field>
                        <label htmlFor="addOption">Add your own option</label>
                        <input type="text" id="customOption" name="customOption" placeholder="Your option" value={customOption} onChange={this.onChange}/>
                    </Form.Field>
                    <Button primary>Vote</Button>
                    </Form>
                }


                {!loading && 
                    <Segment loading= { loading }>
                         <VotePieChart voting={voting} data={options} />
                    </Segment>
                }
                {
                     errors.optionTooShort && <InlineError text={errors.optionTooShort} />
                }

            </div>  
        }
        </div>
    );
  }
}

function mapStateToProps(state){
    return {
        isAuthenticated: !!state.user.token,
        token: state.user.token,
        username:state.user.username
    }
}


export default connect(mapStateToProps, { viewpoll, votepoll })(VotePage)
