import React, { useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import { usePandaBridge } from 'pandasuite-bridge-react';

import { useSetRecoilState } from 'recoil';
import isEmpty from 'lodash/isEmpty';

import resultsAtom from '../../atoms/Results';

const SearchInput = React.forwardRef((props, ref) => {
  const { index, onResults } = props;
  const { properties } = usePandaBridge();

  const [pattern, setPattern] = useState('');
  const setResults = useSetRecoilState(resultsAtom);

  const { limit, liveValidation, isNumber } = properties;

  const results = index.search(pattern, { limit });
  const searchResults = isEmpty(pattern) ? null : results;
  setResults(results);

  const getResults = () => searchResults;
  useImperativeHandle(ref, () => ({
    getResults,
  }));

  if (liveValidation) {
    onResults(searchResults);
  }

  const handleChange = (event) => {
    const value = (event.target.validity.valid) ? event.target.value : pattern;

    setPattern(value);
  };

  const keyPress = (event) => {
    if (event.keyCode === 13) {
      event.target.blur();
    }
  };

  return (
    <input
      type={isNumber ? 'tel' : 'text'}
      pattern={isNumber ? '[0-9]*' : null}
      onInput={handleChange}
      onKeyDown={keyPress}
      value={pattern}
    />
  );
});

SearchInput.defaultProps = {
  onResults: () => null,
};

SearchInput.propTypes = {
  index: PropTypes.oneOfType([PropTypes.object]).isRequired,
  onResults: PropTypes.func,
};

export default SearchInput;
