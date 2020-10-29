import React, { useEffect } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { usePredefinedQuery } from '../miniSdk/hooks';

import { isAuthenticated } from '../miniSdk';

const withAuthentication = Component => props => {
  const history = useHistory();
  //let error, loading, data;
  const { loading, data, error } = usePredefinedQuery({ name: 'auth.get' });

  //console.log('withAuthentication', loading, data, error);

  useEffect(() => {
    console.log('withAuthentication.useEffect', loading, data, error);
    if (!data) history.push('/login');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (!loading && !error && data) ? <Component {...props} /> : null;
}

const ProtectedRoute = ({ component: Component, render, ...rest }) => {
  const ComponentToRender = Component ? withAuthentication(Component) : withAuthentication(render);

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
        : <ComponentToRender {...props} /> // Component should start with capital letter, so the transpiler for React does not complain
      }
    />
  );
};

export default ProtectedRoute;
