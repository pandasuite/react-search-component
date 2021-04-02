import React, { useRef } from 'react';

import PandaBridge from 'pandasuite-bridge';
import { usePandaBridge } from 'pandasuite-bridge-react';

import { useSetRecoilState } from 'recoil';

import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import fromPairs from 'lodash/fromPairs';

import SearchPattern from './SearchPattern';
import patternAtom from '../../atoms/Pattern';

require('flexsearch/dist/flexsearch.es5');

const { FlexSearch } = window;

function docsFromSource(source) {
  if (isObject(source) && source.type === 'Collection') {
    return source.value;
  }
  if (isArray(source)) {
    return map(source, (doc, index) => {
      if (!doc.id) {
        return ({ ...doc, id: index.toString() });
      }
      return doc;
    });
  }
  return [];
}

const triggerEvents = (r) => {
  PandaBridge.send('results', [r]);
  PandaBridge.send(PandaBridge.UPDATED, {
    queryable: {
      results: r,
    },
  });
};

function Search() {
  const resultsEl = useRef(null);
  const setPattern = useSetRecoilState(patternAtom);
  const { properties } = usePandaBridge({
    actions: {
      search: ({ pattern: newPattern }) => {
        setPattern(newPattern);
      },
    },
  });

  if (properties === undefined) {
    return null;
  }

  const {
    keys, charset, tokenize, source,
  } = properties;

  const field = fromPairs(
    map(keys || [], (key) => [
      key.name.join(':'), { charset, tokenize, boost: key.weight },
    ]),
  );

  const index = new FlexSearch({ doc: { id: 'id', field } });
  index.add(docsFromSource(source));

  return (
    <SearchPattern
      ref={resultsEl}
      index={index}
      onResults={triggerEvents}
    />
  );
}

export default Search;
