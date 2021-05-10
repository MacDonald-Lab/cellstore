import React from 'react';

import { useHistory } from 'react-router-dom'
import { Button, Grid, Row, Column, ButtonSet } from 'carbon-components-react';
import { Add16, WatsonHealthDna16 } from '@carbon/icons-react';


const LandingPage = () => {

  const history = useHistory()

  return (
    <Grid>
      <Row className='landing-page__header'>
        <Column>
          <h1>Welcome to CellSTORE!</h1>
        </Column>
      </Row>
      <Row>
        <Column>
          <ButtonSet>
            <Button onClick={() => history.push('/library')} renderIcon={WatsonHealthDna16}>Go to Cell Library</Button>
            <Button onClick={() => history.push('/settings/create')} renderIcon={Add16} kind='ghost'>Create a Library</Button>
          </ButtonSet>
        </Column>
      </Row>
    </Grid>
  )
}
export default LandingPage;