import React, { useRef } from 'react';

import PandaBridge from 'pandasuite-bridge';
import { usePandaBridge } from 'pandasuite-bridge-react';

import { useSetRecoilState } from 'recoil';

import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import each from 'lodash/each';

import SearchPattern from './SearchPattern';
import patternAtom from '../../atoms/Pattern';

const { Document } = require('flexsearch');

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

  const field = map(keys || [], (key) => ({
    field: key.name.join(':'),
    charset,
    tokenize,
    resolution: (key.weight || 9),
  }));

  const index = new Document({ document: { id: 'id', index: field, store: true }, cache: true });
  each(docsFromSource(source), (doc) => index.add(doc));

  return (
    <SearchPattern
      ref={resultsEl}
      index={index}
      onResults={triggerEvents}
    />
  );
}

export default Search;
