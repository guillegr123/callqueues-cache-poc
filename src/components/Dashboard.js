import React from 'react';
import { Container, Header, TableBody } from 'semantic-ui-react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

import { usePredefinedQuery } from '../miniSdk/hooks';

const Dashboard = () => {
  const { data, error, loading } = usePredefinedQuery({ name: 'qubicle_queues.list' });
  
  console.log('Dashboard: Rendering...');

  return (
    <Container text>
      <Header as='h1' dividing>
        Queues
      </Header>
      {
        !loading && !error && (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  Name
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Timestamp
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <TableBody>
              {data.qubicle_queues.map(queue => (
                <Table.Row key={queue.id}>
                  <Table.Cell>
                    {queue.name}
                  </Table.Cell>
                  <Table.Cell>
                    {
                      queue.timestamp
                        ? moment.unix(queue.timestamp).format('YYYY-MM-DD HH:mm:ss')
                        : 'Unknown'
                    }
                  </Table.Cell>
                </Table.Row>
              ))}
            </TableBody>
          </Table>
        )
      }
    </Container>
  );
};

export default Dashboard;

/*
// WS sample messages

// Subscribe
{"action":"subscribe","auth_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImI5ZTkyZDI4OTViZTAyZjliZWExZDkwNGU0MjY2YTE0In0.eyJpc3MiOiJrYXpvbyIsImlkZW50aXR5X3NpZyI6IkdkUUxOXzFTSGFJczhOZGRRNUVuNmJoTnJ4MExydXdoYWFHcU9hbVV6d1UiLCJhY2NvdW50X2lkIjoiZjU5MmY3NjAxOWYxNTIzZjI3M2UxZTMzYzEzYmVlYjQiLCJvd25lcl9pZCI6IjQ0NzE1NWVhZjA4NzQzODQzZGEyYzFkMzYzZTkxMTEyIiwibWV0aG9kIjoiY2JfdXNlcl9hdXRoIiwiZXhwIjoxNjAzOTAxNDgxfQ.L-xlwsQNsayUwgVljurCLgm6m4yy2bcWGZOmbTiEK8dXbDtoIWc3OC4HHzb7YyQeNQikXcvq5XqD55un0Rq9sAT4lcxc85Tb8Oq6GjUDHae-39yoIB3bTWft2ZP5uFJAlajjfOMoSYqHMvgW4fom5DQ1HS-obu85kALmmpNPjnXhFuVZLjmLCiMxrpvSRiAe9YEXuCQZAZyTdBC8qEMpG7YLnJcgRN_PWyrgW4b0HsZkpLDk7D78WErehZGNV2BsbaIKWWYgYjQeWjxoVxYIhjJt3E9bdp1fqnSF4_gaXvFZAITAbrV4cJRxSxYAZ4FA0IY24RDiEuAfjXv_yiQFyA","request_id":"ae64d6512776e577ff2c206b1a9c6aba","data":{"account_id":"f592f76019f1523f273e1e33c13beeb4","binding":"qubicle.recipient"}}
{"action":"unsubscribe","auth_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImI5ZTkyZDI4OTViZTAyZjliZWExZDkwNGU0MjY2YTE0In0.eyJpc3MiOiJrYXpvbyIsImlkZW50aXR5X3NpZyI6IkdkUUxOXzFTSGFJczhOZGRRNUVuNmJoTnJ4MExydXdoYWFHcU9hbVV6d1UiLCJhY2NvdW50X2lkIjoiZjU5MmY3NjAxOWYxNTIzZjI3M2UxZTMzYzEzYmVlYjQiLCJvd25lcl9pZCI6IjQ0NzE1NWVhZjA4NzQzODQzZGEyYzFkMzYzZTkxMTEyIiwibWV0aG9kIjoiY2JfdXNlcl9hdXRoIiwiZXhwIjoxNjAzOTAxNDgxfQ.L-xlwsQNsayUwgVljurCLgm6m4yy2bcWGZOmbTiEK8dXbDtoIWc3OC4HHzb7YyQeNQikXcvq5XqD55un0Rq9sAT4lcxc85Tb8Oq6GjUDHae-39yoIB3bTWft2ZP5uFJAlajjfOMoSYqHMvgW4fom5DQ1HS-obu85kALmmpNPjnXhFuVZLjmLCiMxrpvSRiAe9YEXuCQZAZyTdBC8qEMpG7YLnJcgRN_PWyrgW4b0HsZkpLDk7D78WErehZGNV2BsbaIKWWYgYjQeWjxoVxYIhjJt3E9bdp1fqnSF4_gaXvFZAITAbrV4cJRxSxYAZ4FA0IY24RDiEuAfjXv_yiQFyA","request_id":"7f58c45f7bd294ffcf71037ad4cfc041","data":{"account_id":"f592f76019f1523f273e1e33c13beeb4","binding":"qubicle.recipient"}}
{"action":"subscribe","auth_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImI5ZTkyZDI4OTViZTAyZjliZWExZDkwNGU0MjY2YTE0In0.eyJpc3MiOiJrYXpvbyIsImlkZW50aXR5X3NpZyI6IkdkUUxOXzFTSGFJczhOZGRRNUVuNmJoTnJ4MExydXdoYWFHcU9hbVV6d1UiLCJhY2NvdW50X2lkIjoiZjU5MmY3NjAxOWYxNTIzZjI3M2UxZTMzYzEzYmVlYjQiLCJvd25lcl9pZCI6IjQ0NzE1NWVhZjA4NzQzODQzZGEyYzFkMzYzZTkxMTEyIiwibWV0aG9kIjoiY2JfdXNlcl9hdXRoIiwiZXhwIjoxNjAzOTAxNDgxfQ.L-xlwsQNsayUwgVljurCLgm6m4yy2bcWGZOmbTiEK8dXbDtoIWc3OC4HHzb7YyQeNQikXcvq5XqD55un0Rq9sAT4lcxc85Tb8Oq6GjUDHae-39yoIB3bTWft2ZP5uFJAlajjfOMoSYqHMvgW4fom5DQ1HS-obu85kALmmpNPjnXhFuVZLjmLCiMxrpvSRiAe9YEXuCQZAZyTdBC8qEMpG7YLnJcgRN_PWyrgW4b0HsZkpLDk7D78WErehZGNV2BsbaIKWWYgYjQeWjxoVxYIhjJt3E9bdp1fqnSF4_gaXvFZAITAbrV4cJRxSxYAZ4FA0IY24RDiEuAfjXv_yiQFyA","request_id":"3e10e34e48f45d61722eb974d8db06f5","data":{"account_id":"f592f76019f1523f273e1e33c13beeb4","binding":"qubicle.recipient"}}
{"action":"subscribe","auth_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImI5ZTkyZDI4OTViZTAyZjliZWExZDkwNGU0MjY2YTE0In0.eyJpc3MiOiJrYXpvbyIsImlkZW50aXR5X3NpZyI6IkdkUUxOXzFTSGFJczhOZGRRNUVuNmJoTnJ4MExydXdoYWFHcU9hbVV6d1UiLCJhY2NvdW50X2lkIjoiZjU5MmY3NjAxOWYxNTIzZjI3M2UxZTMzYzEzYmVlYjQiLCJvd25lcl9pZCI6IjQ0NzE1NWVhZjA4NzQzODQzZGEyYzFkMzYzZTkxMTEyIiwibWV0aG9kIjoiY2JfdXNlcl9hdXRoIiwiZXhwIjoxNjAzOTAxNDgxfQ.L-xlwsQNsayUwgVljurCLgm6m4yy2bcWGZOmbTiEK8dXbDtoIWc3OC4HHzb7YyQeNQikXcvq5XqD55un0Rq9sAT4lcxc85Tb8Oq6GjUDHae-39yoIB3bTWft2ZP5uFJAlajjfOMoSYqHMvgW4fom5DQ1HS-obu85kALmmpNPjnXhFuVZLjmLCiMxrpvSRiAe9YEXuCQZAZyTdBC8qEMpG7YLnJcgRN_PWyrgW4b0HsZkpLDk7D78WErehZGNV2BsbaIKWWYgYjQeWjxoVxYIhjJt3E9bdp1fqnSF4_gaXvFZAITAbrV4cJRxSxYAZ4FA0IY24RDiEuAfjXv_yiQFyA","request_id":"09d1f514ba3be6f723c01961e5eb2903","data":{"account_id":"f592f76019f1523f273e1e33c13beeb4","binding":"qubicle.queue"}}
{"action":"subscribe","auth_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImI5ZTkyZDI4OTViZTAyZjliZWExZDkwNGU0MjY2YTE0In0.eyJpc3MiOiJrYXpvbyIsImlkZW50aXR5X3NpZyI6IkdkUUxOXzFTSGFJczhOZGRRNUVuNmJoTnJ4MExydXdoYWFHcU9hbVV6d1UiLCJhY2NvdW50X2lkIjoiZjU5MmY3NjAxOWYxNTIzZjI3M2UxZTMzYzEzYmVlYjQiLCJvd25lcl9pZCI6IjQ0NzE1NWVhZjA4NzQzODQzZGEyYzFkMzYzZTkxMTEyIiwibWV0aG9kIjoiY2JfdXNlcl9hdXRoIiwiZXhwIjoxNjAzOTAxNDgxfQ.L-xlwsQNsayUwgVljurCLgm6m4yy2bcWGZOmbTiEK8dXbDtoIWc3OC4HHzb7YyQeNQikXcvq5XqD55un0Rq9sAT4lcxc85Tb8Oq6GjUDHae-39yoIB3bTWft2ZP5uFJAlajjfOMoSYqHMvgW4fom5DQ1HS-obu85kALmmpNPjnXhFuVZLjmLCiMxrpvSRiAe9YEXuCQZAZyTdBC8qEMpG7YLnJcgRN_PWyrgW4b0HsZkpLDk7D78WErehZGNV2BsbaIKWWYgYjQeWjxoVxYIhjJt3E9bdp1fqnSF4_gaXvFZAITAbrV4cJRxSxYAZ4FA0IY24RDiEuAfjXv_yiQFyA","request_id":"959a805b31e5b4dbcaf3dedfcb194cfe","data":{"account_id":"f592f76019f1523f273e1e33c13beeb4","binding":"dashboard.callcenter_pro"}}

// Event
{"action":"event","subscribed_key":"qubicle.queue","subscription_key":"qubicle.queue.f592f76019f1523f273e1e33c13beeb4.*","name":"sync","routing_key":"qubicle.queue.f592f76019f1523f273e1e33c13beeb4.84c28810f515fb83898ff7e39edd20a8","data":{"app_version":"4.3","app_name":"qubicle","event_unix_timestamp":1603829149,"event_timestamp":63771048349,"msg_id":"afc434090d9169045aacf4cf9a615460","event_category":"qubicle-queue","members":[],"available_recipient_count":0,"active_recipient_count":0,"event_name":"sync","queue_name":"Pilar Test 2500","queue_id":"84c28810f515fb83898ff7e39edd20a8","stats":{"estimated_wait":0,"average_wait":0,"longest_wait":0,"recipient_count":0,"active_session_count":0,"total_sessions":0,"missed_sessions":0,"abandoned_sessions":0},"account_id":"f592f76019f1523f273e1e33c13beeb4"}}
*/
