import React, { useEffect, useState } from 'react';
import { Container, Header, TableBody } from 'semantic-ui-react';
import { Table } from 'semantic-ui-react'

import { listQubicleQueues } from '../utils/miniSdk';

const Dashboard = () => {
  const [queues, setQueues] = useState([]);
  
  useEffect(() => {
    (async () => {
      const queues = await listQubicleQueues();
      setQueues(queues);
    })();
  }, []);

  return (
    <Container text>
      <Header as='h1' dividing>
        Queues
      </Header>
      {
        queues.length > 0 && (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  Name
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <TableBody>
              {queues.map(queue => (
                <Table.Row key={queue.id}>
                  <Table.Cell>
                    {queue.name}
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
