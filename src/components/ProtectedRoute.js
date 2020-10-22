import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, render, ...rest }) => {
  return (
    <Route
      {...rest} // To pass any additional properties
      render={props => {
        if (false) // TODO: Check for logged in user in store
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          );
        return Component ? <Component {...props} /> : render(props); // Component should start with capital letter, so the transpiler for React does not complain
      }}
    />
  );
};

export default ProtectedRoute;
