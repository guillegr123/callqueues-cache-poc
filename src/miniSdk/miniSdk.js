import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { RestLink } from 'apollo-link-rest';
import gql from 'graphql-tag';
import _ from 'lodash';
import md5 from 'md5';

import { api } from '../config.json';

const localStorageSetValue = (key, value) => {
  if (_.isString(value)) {
    localStorage.setItem(key, value);  
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const localStorageGetValue = (key, defaultValue) => {
  const value = localStorage.getItem(key);
  return _.isUndefined(value) ? defaultValue : JSON.parse(value);
};

const AUTH_PUT = gql`
  mutation auth($credentials: Credentials) {
    auth(input: $credentials)
      @rest(type: "Authentication", path: "/desktop_auth", method: "PUT") {
        authToken,
        accountId
      }
  }
`;

const AUTH_GET = gql`
  query auth {
    auth @client {
      authToken,
      accountId
    }
  }
`;

const cache = new InMemoryCache();

const authRestLink = new ApolloLink((operation, forward) => {
  if (operation.operationName !== 'auth') {
    operation.setContext(({ headers }) => {
      const authToken = cache.readQuery({ query: AUTH_GET }).auth.authToken;
      return {
        headers: {
          ...headers,
          Accept: "application/json",
          'X-Auth-Token': authToken
        }
      };
    });
  }

  console.log('ApolloLink', operation, forward, _.isFunction(forward));

  return forward(operation);
});

const restLink = new RestLink({
  uri: api.default,
  responseTransformer: async response => {
    console.log('Response', response);
    return response.clone().json().then(jsonResponse => {
      return (jsonResponse.auth_token && _.isPlainObject(jsonResponse.data))
        ? { ...jsonResponse.data, authToken: jsonResponse.auth_token }
        : jsonResponse.data
    });
  },
  defaultSerializer: (data, headers) => {
    const serializedData = JSON.stringify({ data });
    headers.set('Content-Type', 'application/json');
    return {body: serializedData, headers};
  },
  fieldNameNormalizer: _.camelCase
});

export const graphqlClient = new ApolloClient({
  link: ApolloLink.from([authRestLink, restLink]),
  cache
});

cache.writeQuery({
  query: AUTH_GET,
  data: {
    auth: localStorageGetValue('auth')
  }
});

export const authenticate = async ({ username, password, accountName }) => {
  const credentials = {
    credentials: md5(`${username}:${password}`),
    account_name: accountName
  };

  const { data: { auth } /*, errors */ } = await graphqlClient.mutate({
    mutation: AUTH_PUT,
    variables: { credentials },
    update: (cache, { data: { auth } }) => {
      localStorageSetValue('auth', auth);
      cache.writeQuery({
        query: AUTH_GET,
        data: {
          auth
        }
      });
    }
  });

  return auth;
};

const getAuth = () => cache.readQuery({
  query: AUTH_GET
}).auth;

export const getAuthToken = () => getAuth()?.authToken;

export const getCurrentAccountId = () => getAuth()?.accountId;

export const isAuthenticated = () => !!getAuthToken();

export const connectToWebSocket = () =>
  new Promise((resolve, reject) => {
    const internalWs = new WebSocket(api.socket);
    internalWs.onopen = () => {
      console.log("WS opened");
      resolve(internalWs);
    };
    internalWs.onclose = () => {
      console.log("WS closed");
    };
  });
