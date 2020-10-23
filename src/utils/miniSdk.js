import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { RestLink } from 'apollo-link-rest';
import gql from 'graphql-tag';
import md5 from 'md5';

import { apiUri } from '../config.json';

let authToken = null;

const restLink = new RestLink({
  uri: apiUri,
  responseTransformer: async response =>
    response.json().then(jsonResponse => ({
        ...jsonResponse.data,
        authToken: jsonResponse.auth_token
    })),
  defaultSerializer: (data, headers) => {
    const serializedData = JSON.stringify({ data });
    headers.set('Content-Type', 'application/json');
    return {body: serializedData, headers};
  }
});

const client = new ApolloClient({
  link: restLink,
  cache: new InMemoryCache(),
});

const AUTH = gql`
  mutation auth($credentials: Credentials) {
    auth(input: $credentials)
      @rest(type: "Authentication", path: "/desktop_auth", method: "PUT") {
        authToken
      }
  }
`;

export const authenticate = async ({ username, password, accountName }) => {
  const credentials = {
    credentials: md5(`${username}:${password}`),
    account_name: accountName
  };

  const { data: { auth } /*, errors */ } = await client.mutate({ mutation: AUTH, variables: { credentials } });

  authToken = auth.authToken;

  return auth;
};

export const isAuthenticated = () => !!authToken;
