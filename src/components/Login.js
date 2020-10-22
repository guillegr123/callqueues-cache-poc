import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Form, Segment, Button } from 'semantic-ui-react';

const Login = () => {
  const [state, setState] = useState({});
  const history = useHistory();

  const { username, password, accountName } = state;

  const handleInputChange = (e, { name, value }) => setState({ [name]: value })

  const handleOnSignIn = () => {
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

            <Button color='teal' fluid size='large' onClick={handleOnSignIn}>
              Sign In
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
