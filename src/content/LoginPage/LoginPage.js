import { React, useState } from 'react';
import { Grid, Row, Column, TextInput, Button } from 'carbon-components-react';
import { useHistory } from 'react-router-dom'


const LoginPage = () => {

  const history = useHistory()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameReg, setUsernameReg] = useState('')
  const [passwordReg, setPasswordReg] = useState('')
  const [message, setMessage] = useState(undefined)

  const handleLogin = async () => {


    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: username, password: password})
    })

    if (response.status === 200) {
      history.push('/')
    } else {
      setMessage(await response.json())
    }
  }


  const handleRegister = async () => {

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: usernameReg, password: passwordReg})
    })

    if (response.status === 200) {
      history.push('/login')
    } else {
      setMessage(await response.json())
    }
  }
  const handleTextInput = (e, setter) => setter(e.target.value)

  return (
    <Grid>
      <Row>
        <Column>
          <h2>Login to CellSTORE</h2>
          <br />
          <br />
        </Column>
      </Row>
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
          <Button onClick={handleLogin}>Login</Button>
        </Column>
      </Row>
      <Row>
        <Column>
          <h2>Register for CellSTORE</h2>
          <br />
          <br />
        </Column>
      </Row>
      <Row>
        <Column>
          <TextInput
            labelText="Username"
            type="email"
            value={usernameReg}
            onChange={(e) => handleTextInput(e, setUsernameReg)}
          />
          <br />
          <TextInput
            labelText="Password"
            type="password"
            value={passwordReg}
            onChange={(e) => handleTextInput(e, setPasswordReg)}
          />
          <br />

        </Column>
      </Row>
      <Row>
        <Column>
          <Button onClick={handleRegister}>Register</Button>
          {message && message.message}
        </Column>
      </Row>
    </Grid>

  )
}

export default LoginPage;