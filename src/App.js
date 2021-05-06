import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';

import { Content } from 'carbon-components-react';
import UIShell from './components/UIShell';

import LandingPage from './content/LandingPage';

// Route Definitions



const App = () => (
  <Router>
    <UIShell />
    <Content id='main-content'>
      <Switch>
        <Route exact path="/" component={LandingPage} />
      </Switch>
    </Content>
  </Router>

)

export default App;
