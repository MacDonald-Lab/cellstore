import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';

import { Content } from 'carbon-components-react';
import UIShell from './components/UIShell';

import LandingPage from './content/LandingPage';
import LibraryPage from './content/LibraryPage';
import CellInfoPage from './content/CellInfoPage/CellInfoPage';
import UploadPage from './content/UploadPage';
import CreateLibraryPage from './content/CreateLibraryPage';

// Route Definitions

const App = () => (
  <Router>
    <UIShell />
    <Content >

      <Switch>
        <Route exact path="/" component={LandingPage} />
      </Switch>

      <Switch>
        <Route exact path="/library" component={LibraryPage} />
      </Switch>

      <Switch>
        <Route exact path="/library/cell/:id" component={CellInfoPage} />
      </Switch>

      <Switch>
        <Route exact path="/library/upload/" component={UploadPage} />
      </Switch>

      <Switch>
        <Route exact path='/settings/create' component={CreateLibraryPage} />
      </Switch>
    </Content>
  </Router>

)

export default App;
