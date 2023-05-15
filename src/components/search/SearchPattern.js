/* eslint-disable no-param-reassign */
import { usePandaBridge } from 'pandasuite-bridge-react';
import { useSetRecoilState, useRecoilValue } from 'recoil';

import isEmpty from 'lodash/isEmpty';
import each from 'lodash/each';
import compact from 'lodash/compact';

import resultsAtom from '../../atoms/Results';
import patternAtom from '../../atoms/Pattern';

const getCompatResultsWithLimit = (rawSearch, limit, results = [], startIndex = 0, ids = {}) => {
  if (rawSearch.length === 0) {
    return results;
  }

  const addDoc = (r) => {
    if (ids[r.id] === undefined) {
      ids[r.id] = 0;
      results.push(r.doc);
    }
    ids[r.id] += 1;
  };

  if (limit <= 0 && results.length === 0) {
    each(rawSearch, (search) => {
      each(search.result, (r) => {
        addDoc(r);
      });
    });
    return results;
  }

  const startResultsLength = results.length;
  const limitBySearch = Math.ceil((limit - startResultsLength) / rawSearch.length);

  each(rawSearch, (search) => {
    each(search.result.slice(startIndex, startIndex + limitBySearch), (r) => {
      addDoc(r);
    });
  });

  if (results.length < limit && results.length !== startResultsLength) {
    return getCompatResultsWithLimit(rawSearch, limit, results, startIndex + limitBySearch, ids);
  }
  return results.slice(0, limit);
};

function SearchPattern(props) {
  const { index, onResults } = props;
  const { properties } = usePandaBridge();
  const pattern = useRecoilValue(patternAtom);
  const setResults = useSetRecoilState(resultsAtom);

  const { limit } = properties;
  const ids = {};

  const rawSearch = index.search(pattern, { enrich: true, limit });
  const results = getCompatResultsWithLimit(rawSearch, limit, undefined, undefined, ids);

  if ((limit <= 0 || results.length < limit) && pattern && pattern.indexOf(' ') > 0) {
    const queries = compact(pattern.split(' '));
    const additionalIds = {};

    each(queries, (query) => {
      const additionalRawSearch = index.search(query, { enrich: true, limit });
      const additionalResults = getCompatResultsWithLimit(additionalRawSearch, limit);

      each(additionalResults, (r) => {
        if (additionalIds[r.id] === undefined) {
          additionalIds[r.id] = [];
        }
        additionalIds[r.id].push(r);
      });
    });

    each(additionalIds, (r, k) => {
      if (r.length === queries.length && ids[k] === undefined) {
        ids[k] = 0;
        results.push(r[0]);
      }
    });
  }

  const searchResults = isEmpty(pattern) ? null : results;
  setResults(results);
  onResults(searchResults);

  return null;
}

export default SearchPattern;
