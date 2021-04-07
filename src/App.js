import React from 'react';

import './App.css';

import { usePandaBridge } from 'pandasuite-bridge-react';

import IntlProvider from './components/IntlProvider';
import Configuration from './components/configuration/Configuration';
import Search from './components/search/Search';

function App() {
  const { properties } = usePandaBridge();

  if (properties === undefined) {
    return null;
  }

  return (
    <IntlProvider>
      <div>
        <Search />
        <Configuration />
      </div>
    </IntlProvider>
  );
}

export default App;
