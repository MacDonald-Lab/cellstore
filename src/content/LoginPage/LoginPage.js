import { React, useState } from 'react';
import { Grid, Row, Column, TextInput, Button, ButtonSet } from 'carbon-components-react';
import { useHistory } from 'react-router-dom'


const LoginPage = () => {

  const history = useHistory()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(undefined)

  const handleLogin = async () => {


    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username, password: password })
    })

    if (response.status === 200) {
      history.push('/')
    } else {
      const toJson = await response.json()
      setMessage(toJson)
    }
  }

  const handleTextInput = (e, setter) => setter(e.target.value)
  
  return (

    <Grid style={{ maxWidth: 600 }}>
      <Row>
        <Column>
          <TextInput
            labelText="Username"
            type="email"
            value={username}
            onChange={(e) => handleTextInput(e, setUsername)}
          />
          <br />
          <TextInput
            labelText="Password"
            type="password"
            value={password}
            onChange={(e) => handleTextInput(e, setPassword)}
          />
          <br />

        </Column>
      </Row>
      <Row>
        <Column>
          <ButtonSet>

            <Button onClick={handleLogin}>Login</Button>
            <Button kind="ghost" onClick={() => history.push('/register')}>Create an account</Button>
          </ButtonSet>
          {message && message.message}
        </Column>
      </Row>
    </Grid>

  )
}

export default LoginPage;