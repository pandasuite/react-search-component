import React, { useRef } from 'react';

import PandaBridge from 'pandasuite-bridge';
import { usePandaBridge } from 'pandasuite-bridge-react';

import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import debounce from 'lodash/debounce';
import map from 'lodash/map';
import fromPairs from 'lodash/fromPairs';
import SearchInput from './SearchInput';

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

let triggerEvents = () => null;

function Search() {
  const resultsEl = useRef(null);
  const { properties } = usePandaBridge({
    actions: {
      validate: () => {
        if (resultsEl.current) {
          triggerEvents(resultsEl.current.getResults());
        }
      },
    },
  });

  if (properties === undefined) {
    return null;
  }

  const {
    debounceTime, keys, charset, tokenize, source,
  } = properties;

  triggerEvents = debounce((r) => {
    PandaBridge.send('newSearchResults', [r]);
  }, debounceTime === undefined ? 300 : debounceTime);

  const field = fromPairs(
    map(keys || [], (key) => [
      key.name.join(':'), { charset, tokenize, boost: key.weight },
    ]),
  );

  const index = new FlexSearch({ doc: { id: 'id', field } });
  index.add(docsFromSource(source));

  return (
    <SearchInput
      ref={resultsEl}
      index={index}
      onResults={triggerEvents}
    />
  );
}

export default Search;
