import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { AppContext } from './AppContext';

// Import Components for navigation
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './components/home/Home';

const Router = () => {

  return (
    <Switch>

      <Route exact path="/">
        <Login />
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