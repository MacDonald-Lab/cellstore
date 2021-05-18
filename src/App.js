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
import SettingsPage from './content/SettingsPage';
import ComputationPage from './content/ComputationPage';
import ImageClassificationTestPage from './content/ImageClassificationTestPage';
import LoginPage from './content/LoginPage';

// Route Definitions

const App = () => <Router>

  <UIShell />

  <Content >

    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/library" component={LibraryPage} />
      <Route exact path="/library/cell/:id" component={CellInfoPage} />
      <Route exact path="/library/upload/" component={UploadPage} />
      <Route exact path='/settings' component={SettingsPage} />
      <Route exact path='/settings/create' component={CreateLibraryPage} />
      <Route exact path='/computations' component={ComputationPage} />
      <Route exact path='/computations/image-test' component={ImageClassificationTestPage} />
      <Route exact path='/login' component={LoginPage} />
    </Switch>

  </Content>

</Router>

export default App;
