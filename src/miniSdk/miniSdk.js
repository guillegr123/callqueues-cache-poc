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
}

const authRestLink = new ApolloLink((operation, forward) => {
  if (operation.operationName === 'auth') {
    return forward(operation).map(result => {
      const { restResponses } = operation.getContext();
      const authResponse = restResponses.find(resp =>
        resp.url.endsWith('desktop_auth') && resp.status === 201
      );

      if (!authResponse) {
        return result;
      }

      authResponse.clone().json().then(jsonResponse =>
        localStorageSetValue('auth', {
          authToken: jsonResponse.auth_token,
          accountId: jsonResponse.data.account_id
        })
      );
  
      return result;
    });
  } else {
    operation.setContext(({ headers }) => {
      const authToken = localStorageGetValue('auth')?.authToken;
      return {
        headers: {
          ...headers,
          Accept: "application/json",
          'X-Auth-Token': authToken
        }
      };
    });

    return forward(operation);
  }
});

const restLink = new RestLink({
  uri: api.default,
  responseTransformer: async response =>
    response.clone().json().then(jsonResponse => {
      return (jsonResponse.auth_token && _.isPlainObject(jsonResponse.data))
        ? { ...jsonResponse.data, authToken: jsonResponse.auth_token }
        : jsonResponse.data
    }),
  defaultSerializer: (data, headers) => {
    const serializedData = JSON.stringify({ data });
    headers.set('Content-Type', 'application/json');
    return {body: serializedData, headers};
  },
  fieldNameNormalizer: _.camelCase
});

export const graphqlClient = new ApolloClient({
  link: ApolloLink.from([authRestLink, restLink]),
  cache: new InMemoryCache(),
});

const AUTH = gql`
  mutation auth($credentials: Credentials) {
    auth(input: $credentials)
      @rest(type: "Authentication", path: "/desktop_auth", method: "PUT") {
        authToken,
        accountId
      }
  }
`;

export const authenticate = async ({ username, password, accountName }) => {
  const credentials = {
    credentials: md5(`${username}:${password}`),
    account_name: accountName
  };

  const { data: { auth } /*, errors */ } = await graphqlClient.mutate({ mutation: AUTH, variables: { credentials } });

  localStorageSetValue('auth', auth);

  return auth;
};

export const getAuthToken = () => localStorageGetValue('auth')?.authToken;

export const getCurrentAccountId = () => localStorageGetValue('auth')?.accountId;

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
