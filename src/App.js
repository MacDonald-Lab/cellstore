import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import { Loading } from 'carbon-components-react'

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

import InitialSetupPage from './content/InitialSetupPage'
import API from './components/API'

const LoadingScreen = () => <div className="loading__container">
  <div className="loading__elements">
    <h1>CellSTORE</h1>
    <br />
    <br />
    <br />
    <br />
    <div className="loading__indicator">

      <Loading small={true} withOverlay={false} />
    </div>
    <br />
    <p>Please wait while the application loads.</p>


  </div>

</div>


// Route Definitions

const App = () => {

  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [libraries, setLibraries] = useState(null)

  useEffect(() => {
    const get = async() => {
      await API.getSettings(setSettings)
      await API.getLibraries(setLibraries)
      setLoading(false)

    }
    get()
  }, [])


  if (loading) return <LoadingScreen />
  if (!settings) return <InitialSetupPage />

  return <Router>

    <UIShell libraries={libraries} organizationName={settings ? settings['organizationName'] : ""} />

    <Content >

      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/library/:libraryName" component={LibraryPage} />
        <Route exact path="/library/:libraryName/cell/:cellId" component={CellInfoPage} />
        <Route exact path="/library/:libraryName/upload/" component={UploadPage} />
        <Route exact path='/settings' component={SettingsPage} />
        <Route exact path='/settings/create' component={CreateLibraryPage} />
        <Route exact path='/computations' component={ComputationPage} />
        <Route exact path='/computations/image-test' component={ImageClassificationTestPage} />
        <Route exact path='/login' component={LoginPage} />
      </Switch>

    </Content>

  </Router>
}

export default App;
