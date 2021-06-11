import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.scss';
import { Loading } from 'carbon-components-react'

import { useFetch } from './components/Hooks.tsx'

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
import ComputationInfoPage from './content/ComputationInfoPage';
import RegisterPage from './content/RegisterPage';

import InitialSetupPage from './content/InitialSetupPage'
import UserProvider from './contexts/UserProvider';

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

const AuthRoutes = () => {

  const { loading, data } = useFetch([
    { url: 'getSettings' },
    { url: 'getLibraries' }
  ])

  const settings = data['getSettings']
  const libraries = data['getLibraries']

  if (loading) return <LoadingScreen />
  if (!settings) return <InitialSetupPage />
  else return <> <UserProvider>


    <UIShell libraries={libraries} organizationName={settings ? settings['organizationName'] : ""} />

    <Content>

      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/library/:libraryName" component={LibraryPage} />
        <Route exact path="/library/:libraryName/cell/:cellId" component={CellInfoPage} />
        <Route exact path="/library/:libraryName/upload/" component={UploadPage} />
        <Route exact path='/settings' component={SettingsPage} />
        <Route exact path='/settings/create' component={CreateLibraryPage} />
        <Route exact path='/computations' component={ComputationPage} />
        <Route exact path='/computation/:computationName' component={ComputationInfoPage} />
        <Route exact path='/computations/image-test' component={ImageClassificationTestPage} />
      </Switch>

    </Content>
  </UserProvider>

  </>
}

const App = () => <Switch>
  <Route exact path='/login' component={LoginPage} />
  <Route exact path='/register' component={RegisterPage} />
  <AuthRoutes />
</Switch>

export default App;
