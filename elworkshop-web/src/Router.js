import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Import Components for navigation
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './components/home/Home';
import Landing from './components/home/Landing'

const Router = () => {

  return (
    <Switch>

      <Route exact path="/">
        <Landing />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/registro">
        <Signup />
      </Route>
      <Route path="/home">
        <Home />
      </Route>

    </Switch>
  )
};

export default Router;