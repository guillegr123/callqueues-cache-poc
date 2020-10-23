import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Form, Segment, Button, Loader } from 'semantic-ui-react';

import { authenticate } from '../utils/miniSdk';

const Login = () => {
  const [state, setState] = useState({});
  const [isLoading, setLoading] = useState(false);
  const history = useHistory();

  const { username, password, accountName } = state;

  const handleInputChange = (e, { name, value }) => setState({ ...state, [name]: value })

  const handleOnSignIn = async () => {
    setLoading(true);
    await authenticate(state);
    setLoading(false);
    history.push('/dashboard');
  };

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Form size='large'>
          <Segment>
            <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' name='username' value={username} onChange={handleInputChange} />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              name='password'
              value={password}
              onChange={handleInputChange}
            />
            <Form.Input fluid icon='book' iconPosition='left' placeholder='Account Name' name='accountName' value={accountName} onChange={handleInputChange} />

            <Button color='teal' fluid size='big' onClick={handleOnSignIn}>
              <Loader inline size='small' active={isLoading} />
              {!isLoading && <>Sign In</>}
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
