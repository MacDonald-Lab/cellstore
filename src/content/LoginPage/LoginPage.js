import { React, useState } from 'react';
import { Grid, Row, Column, TextInput, Button } from 'carbon-components-react';
import { useHistory } from 'react-router-dom'


const LoginPage = () => {

  const history = useHistory()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameReg, setUsernameReg] = useState('')
  const [passwordReg, setPasswordReg] = useState('')
  const [nameReg, setNameReg] = useState('')

  const handleLogin = async () => {

    var formData = new FormData()
    formData.append('email', username)
    formData.append('password', password)

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    })

    if (response.status === 200) {
      history.push('/login')
    }
  }


  const handleRegister = async () => {

    var formData = new URLSearchParams()
    formData.append('name', nameReg)
    formData.append('email', usernameReg)
    formData.append('password', passwordReg)

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    })

    if (response.status === 200) {
      history.push('/login')
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
            labelText="Name"
            type="text"
            value={nameReg}
            onChange={(e) => handleTextInput(e, setNameReg)}
          />
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
        </Column>
      </Row>
    </Grid>

  )
}

export default LoginPage;