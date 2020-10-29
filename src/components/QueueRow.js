import React, { useEffect, useState } from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';
import _ from 'lodash';

const QueueRow = ({ name, activeRecipientCount, availableRecipientCount, timestamp }) => {
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    setHighlight(true);
    setTimeout(() => {
      setHighlight(false);
    }, 1000);
  }, [timestamp]);

  return (
    <Table.Row className={highlight ? 'row-highlight' : ''}>
      <Table.Cell>
        {name}
      </Table.Cell>
      <Table.Cell>
        {(_.isNil(activeRecipientCount) ? 'Unknown' : _.toString(activeRecipientCount))}
      </Table.Cell>
      <Table.Cell>
        {(_.isNil(availableRecipientCount) ? 'Unknown' : _.toString(availableRecipientCount))}
      </Table.Cell>
      <Table.Cell>
        {
          timestamp
            ? moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss')
            : 'Unknown'
        }
      </Table.Cell>
    </Table.Row>
  )
};

export default QueueRow;
