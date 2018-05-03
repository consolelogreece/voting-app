import React, { Component } from 'react';
import { Segment, Loader, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { mypolls, deletepoll } from '../../actions/poll'

class MyPollsPage extends Component {
constructor(){
        super();
        this.state = {
            polls: [],
            loading:true    
        }
    }

    componentDidMount(){
        this.props.mypolls({token:this.props.token}).then(data => {

            this.setState({polls: data, loading:false})

        }).catch(() => this.props.history.push("/"))
    }

    deletePoll(title){


       this.removePollFromState(title)

        this.props.deletepoll({title:title, token:this.props.token}).then(() => {
            //removePollFromState(title)
        }).catch(() => {
            alert("Oops, something went wrong...")
        })
    }



    removePollFromState(title){
   
        let array = [];
        this.state.polls.forEach(poll => {
           
            if (poll.title !== title) {
                array.push(poll)
            }
        });

        this.setState({polls:array})

    }


    makeUrlFriendly(string){

    let validatedString = string;
    validatedString =  string.replace(" " , "%20");
    validatedString = string.replace("?", "%3f")
    return validatedString
  
  }



    mapPolls(){
        let pollArray = [];
  
        this.state.polls.forEach(poll => {

              pollArray.push(
                <div key={poll.title} id={poll.title} name={poll.title} className="ui raised segment"> <Button name={poll.title} onClick={(event) => this.deletePoll(event.target.name)} circular={true} negative={true} compact={true} floated="right"> X </Button> 
                    <Link to={"/poll/" + this.makeUrlFriendly(this.props.username) + "/" + this.makeUrlFriendly(poll.title)}>{poll.title}</Link> <br />
                    {poll.options.map(x => {
                        return <div>{x.option} : {x.score}</div>
                    })}
                </div>
            )

        });

       return pollArray;
    }

     
    




  render(){

    let pollArray = this.mapPolls();
    const { loading } = this.state
    return (
        <div>
            <Segment loading= { loading }>
                {pollArray}
            </Segment>
        </div>  
    );
  }
}

function mapStateToProps(state){
    return {
        isAuthenticated: !!state.user.token,
        token: state.user.token,
        username: state.user.username
    }
}

export default connect(mapStateToProps, { mypolls, deletepoll })(MyPollsPage)
