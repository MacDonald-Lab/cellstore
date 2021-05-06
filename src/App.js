import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';

import { Content } from 'carbon-components-react';
import UIShell from './components/UIShell';

import LandingPage from './content/LandingPage';
import LibraryPage from './content/LibraryPage';

// Route Definitions

const App = () => (
  <Router>
    <UIShell />
    <Content id='main-content'>

      <Switch>
        <Route exact path="/" component={LandingPage} />
      </Switch>

      <Switch>
        <Route exact path="/library" component={LibraryPage} />
      </Switch>

    </Content>
  </Router>

)

export default App;
