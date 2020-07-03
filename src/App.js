import React, { useState } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { usePandaBridge } from 'pandasuite-bridge-react';

import IntlProvider from './components/IntlProvider';
import Search from './components/search/Search';

function App() {
  const [pattern, setPattern] = useState('');
  const { properties } = usePandaBridge();

  if (properties === undefined) {
    return null;
  }

  const { inputType } = properties;

  const handleChange = (event) => {
    const value = (event.target.validity.valid) ? event.target.value : pattern;

    setPattern(value);
  };

  return (
    <IntlProvider>
      <div className="App">
        <input
          type={inputType}
          pattern={inputType === 'text' ? null : '[0-9]*'}
          onInput={handleChange}
          value={pattern}
        />
        <Search pattern={pattern} />
      </div>
    </IntlProvider>
  );
}

export default App;
