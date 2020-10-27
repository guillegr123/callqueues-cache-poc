import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { RestLink } from 'apollo-link-rest';
import gql from 'graphql-tag';
import _ from 'lodash';
import md5 from 'md5';

import { apiUri } from '../config.json';

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
  uri: apiUri,
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

const client = new ApolloClient({
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

const QUBICLE_QUEUES = gql`
  query qubicle_queues($accountId: String) {
    qubicle_queues(accountId: $accountId)
      @rest(type: "[QubicleQueue]", path: "/accounts/{args.accountId}/qubicle_queues", method: "GET") {
        id,
        name
      }
  }
`;

export const authenticate = async ({ username, password, accountName }) => {
  const credentials = {
    credentials: md5(`${username}:${password}`),
    account_name: accountName
  };

  const { data: { auth } /*, errors */ } = await client.mutate({ mutation: AUTH, variables: { credentials } });

  localStorageSetValue('auth', auth);

  return auth;
};

export const isAuthenticated = () => !!localStorageGetValue('auth')?.authToken;

export const listQubicleQueues = (args) => {
  const accountId = _.get(
    args,
    'accountId',
    localStorageGetValue('auth')?.accountId
  );

  return client
    .query({ query: QUBICLE_QUEUES, variables: { accountId } })
    .then(({ data }) => data.qubicle_queues);
};
