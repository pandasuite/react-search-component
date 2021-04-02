import React from 'react';

import { useSetRecoilState, useRecoilValue } from 'recoil';

import patternAtom from '../../atoms/Pattern';

const SearchInput = () => {
  const pattern = useRecoilValue(patternAtom);
  const setPattern = useSetRecoilState(patternAtom);

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
      type="text"
      onInput={handleChange}
      onKeyDown={keyPress}
      value={pattern}
    />
  );
};

export default SearchInput;
