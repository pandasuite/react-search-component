import React from 'react';

import './App.css';

import { usePandaBridge } from 'pandasuite-bridge-react';
import PandaBridge from 'pandasuite-bridge';

import IntlProvider from './components/IntlProvider';
import Configuration from './components/configuration/Configuration';
import Search from './components/search/Search';

function App() {
  const { properties } = usePandaBridge();

  if (properties === undefined) {
    return null;
  }

  const { [PandaBridge.LANGUAGE]: language } = properties;

  return (
    <IntlProvider language={language}>
      <div>
        <Search />
        <Configuration />
      </div>
    </IntlProvider>
  );
}

export default App;
