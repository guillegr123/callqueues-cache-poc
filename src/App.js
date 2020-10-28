import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import { MiniSdkProvider } from './miniSdk';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

function App() {
  return (
    <MiniSdkProvider>
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login} />
          <ProtectedRoute path='/dashboard' component={Dashboard} />
          <Redirect to='login' />
        </Switch>
      </BrowserRouter>
    </MiniSdkProvider>
  );
}

export default App;
