
import { React, useState } from 'react';
import { Grid, Row, Column, TextInput, Button } from 'carbon-components-react';
import { useHistory } from 'react-router-dom'
import PageSection from '../../components/PageSection/PageSection';


const LoginPage = () => {

  const history = useHistory()

  const [usernameReg, setUsernameReg] = useState('')
  const [passwordReg, setPasswordReg] = useState('')
  const [message, setMessage] = useState(undefined)

  const handleRegister = async () => {

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: usernameReg, password: passwordReg })
    })

    if (response.status === 200) {
      history.push('/login')
    } else {
      setMessage(await response.json())
    }
  }
  const handleTextInput = (e, setter) => setter(e.target.value)

  return (

    <Grid className="register-page__main">

      <PageSection title="Register for CellSTORE" />

      <Row>
        <Column>
          <TextInput
            labelText="Username"
            type="email"
            value={usernameReg}
            onChange={(e) => handleTextInput(e, setUsernameReg)}
          />

          <TextInput
            labelText="Password"
            type="password"
            value={passwordReg}
            onChange={(e) => handleTextInput(e, setPasswordReg)}
          />

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