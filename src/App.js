import React, { useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import { connectToWebSocket } from './utils/miniSdk';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

function App() {
  useEffect(connectToWebSocket, []);

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
