import React, { Component } from 'react';
import { Route, Redirect, withRouter, Switch } from 'react-router-dom'
import HomePage from './components/pages/HomePage'
import LoginPage from './components/pages/LoginPage'
import SignUpPage from './components/pages/SignUpPage'
import NewPollPage from './components/pages/NewPollPage'
import MyPollsPage from './components/pages/MyPollsPage'
import VotePage from './components/pages/VotePage'
import NavBar from './components/navbar/NavBar'
import { connect } from 'react-redux'


const PrivateRoute = ({isAuthenticated, component: Component, ...rest}) => (
  <Route
    {...rest}
    render={props =>
       isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to="/login"   
        />
      )
    }
  />
);


const App = ({ isAuthenticated }) => (


    <div>
      <NavBar />
      <Switch>
        <Route path='/signup' exact component={SignUpPage} />
        <Route path="/login" exact component={LoginPage} />
        <PrivateRoute isAuthenticated={isAuthenticated} path="/newpoll" exact component={NewPollPage} />
        <PrivateRoute isAuthenticated={isAuthenticated} path="/mypolls" exact component={MyPollsPage} />
        <Route path="/poll/*" component={VotePage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </div>
  
  )


function mapStateToProps(state){
  
  return {
    isAuthenticated: !!state.user.token
  }
}


export default withRouter(connect(mapStateToProps)(App));
