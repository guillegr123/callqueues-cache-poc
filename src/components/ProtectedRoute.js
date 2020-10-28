import React from "react";
import { Route, Redirect } from "react-router-dom";

import { isAuthenticated } from '../miniSdk';

const ProtectedRoute = ({ component: Component, render, ...rest }) => {
  return (
    <Route
      {...rest} // To pass any additional properties
      render={
        props => !isAuthenticated() ? (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
        : Component ? <Component {...props} />
        : render(props)  // Component should start with capital letter, so the transpiler for React does not complain
      }
    />
  );
};

export default ProtectedRoute;
