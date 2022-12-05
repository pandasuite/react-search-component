import { usePandaBridge } from 'pandasuite-bridge-react';
import { useSetRecoilState, useRecoilValue } from 'recoil';

import isEmpty from 'lodash/isEmpty';
import flatMap from 'lodash/flatMap';
import map from 'lodash/map';

import resultsAtom from '../../atoms/Results';
import patternAtom from '../../atoms/Pattern';

const getCompatResultsWithLimit = (rawSearch, limit, results = [], startIndex = 0) => {
  if (rawSearch.length === 0) {
    return results;
  }
  if (limit <= 0 && results.length === 0) {
    return flatMap(rawSearch, (s) => flatMap(s.result, (r) => r.doc));
  }

  const startResultsLength = results.length;
  const limitBySearch = Math.ceil((limit - startResultsLength) / rawSearch.length);

  map(rawSearch, (search) => {
    results.push(...flatMap(
      search.result.slice(startIndex, startIndex + limitBySearch), (r) => r.doc,
    ));
  });

  if (results.length < limit && results.length !== startResultsLength) {
    return getCompatResultsWithLimit(rawSearch, limit, results, startIndex + limitBySearch);
  }
  return results.slice(0, limit);
};

function SearchPattern(props, ref) {
  const { index, onResults } = props;
  const { properties } = usePandaBridge();
  const pattern = useRecoilValue(patternAtom);
  const setResults = useSetRecoilState(resultsAtom);

  const { limit } = properties;

  const rawSearch = index.search(pattern, { enrich: true, limit });
  const results = getCompatResultsWithLimit(rawSearch, limit);

  const searchResults = isEmpty(pattern) ? null : results;
  setResults(results);
  onResults(searchResults);

  return null;
}

export default SearchPattern;
