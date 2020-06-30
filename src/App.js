import React, { useState } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import IntlProvider from './components/IntlProvider';
import Search from './components/search/Search';

function App() {
  const [pattern, setPattern] = useState('');

  const handleChange = (event) => {
    setPattern(event.target.value);
  };

  return (
    <IntlProvider>
      <div className="App">
        <input type="text" onChange={handleChange} />
        <Search pattern={pattern} />
      </div>
    </IntlProvider>
  );
}

export default App;
