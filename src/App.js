import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';

import 'semantic-ui-css/semantic.min.css';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' component={Login} />
        <ProtectedRoute path='/dashboard' component={Dashboard} />
        <Redirect to='login' />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
