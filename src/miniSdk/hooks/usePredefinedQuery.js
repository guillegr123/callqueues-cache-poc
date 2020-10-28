import { useContext, useRef } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import gql from 'graphql-tag';
import _ from 'lodash';

import { getAuthToken, getCurrentAccountId } from '../miniSdk';
import { MiniSdkContext } from '../MiniSdkProvider';

const queries = {
  qubicle_queues: {
    list: {
      query: gql`
        query qubicle_queues($accountId: String) {
          qubicle_queues(accountId: $accountId)
            @rest(type: "[QubicleQueue]", path: "/accounts/{args.accountId}/qubicle_queues", method: "GET") {
              id,
              name,
              timestamp,
              activeRecipientCount,
              availableRecipientCount
            }
        }
      `,
      wsSubscription: {
        binding: 'qubicle.queue',
        propMap: {
          id: 'queue_id',
          timestamp: 'event_unix_timestamp',
          activeRecipientCount: 'active_recipient_count',
          availableRecipientCount: 'available_recipient_count'
        }
      }
    }
  }
};

const usePredefinedQuery = ({ name, variables: pVariables = {} }) => {
  const wsActiveSubscriptions = useRef([]);
  const { ws } = useContext(MiniSdkContext);
  const graphqlClient = useApolloClient();
  const collectionName = name.substring(0, name.indexOf('.'));
  const { query, wsSubscription } = _.get(queries, name);
  const accountId = _.get(pVariables, 'accountId', getCurrentAccountId());
  const variables = {
    accountId,
    ...pVariables
  };
  const onQueryCompleted = () => {
    const { binding, propMap } = wsSubscription;

    if (wsActiveSubscriptions.current.includes(binding)) {
      return;
    }

    wsActiveSubscriptions.current.push(binding);

    ws.then(ws => {
      ws.addEventListener('message', e => {
        const message = JSON.parse(e.data);
        const eventData = message.data;
        const queryData = graphqlClient.readQuery({
          query,
          variables
        });
        const collectionData = _.get(queryData, collectionName);
        const idProp = _.get(propMap, 'id', 'id');
        const eventDataId = _.get(eventData, idProp);
        const itemToUpdate = collectionData.find(item => item.id === eventDataId)
        console.log('usePredefinedQuery: Socket message received', binding, message);

        if (!itemToUpdate) {
          return;
        }

        console.log('usePredefinedQuery: Cache item to update found', itemToUpdate);

        graphqlClient.writeQuery({
          query,
          variables,
          data: {
            [collectionName]: collectionData.map(item => {
              if (item.id !== eventDataId) {
                return item;
              }

              const newValues = _.chain(propMap)
                .omit('id')
                .mapValues(eventDataPropName => _.get(eventData, eventDataPropName))
                .value();

              return {
                ...item,
                ...newValues
              };
            })
          },
        });
      });

      ws.send(JSON.stringify({
        action: 'subscribe',
        auth_token: getAuthToken(),
        data: {
          account_id: accountId,
          binding
        }
      }));
    });
  };

  return useQuery(query, {
    variables,
    onCompleted: wsSubscription && onQueryCompleted
  });
};

export default usePredefinedQuery;
