import dotenv from 'dotenv';
dotenv.config()

import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client'

import 'core-js/modules/es.array.includes';
import 'core-js/modules/es.array.fill';
import 'core-js/modules/es.string.includes';
import 'core-js/modules/es.string.trim';
import 'core-js/modules/es.object.values';;

// Apollo/GraphQL Database Connection

const client = new ApolloClient({
  uri: process.env.GRAPH_URI,
  cache: new InMemoryCache()

})

ReactDOM.render(

  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,

  document.getElementById('root')

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
