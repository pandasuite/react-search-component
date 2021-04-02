import React, { useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import { usePandaBridge } from 'pandasuite-bridge-react';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import isEmpty from 'lodash/isEmpty';

import resultsAtom from '../../atoms/Results';
import patternAtom from '../../atoms/Pattern';

const SearchPattern = React.forwardRef((props, ref) => {
  const { index, onResults } = props;
  const { properties } = usePandaBridge();
  const pattern = useRecoilValue(patternAtom);
  const setResults = useSetRecoilState(resultsAtom);

  const { limit } = properties;

  const results = index.search(pattern, { limit });
  const searchResults = isEmpty(pattern) ? null : results;
  setResults(results);

  const getResults = () => searchResults;
  useImperativeHandle(ref, () => ({
    getResults,
  }));

  onResults(searchResults);

  return null;
});

SearchPattern.defaultProps = {
  onResults: () => null,
};

SearchPattern.propTypes = {
  index: PropTypes.oneOfType([PropTypes.object]).isRequired,
  onResults: PropTypes.func,
};

export default SearchPattern;
