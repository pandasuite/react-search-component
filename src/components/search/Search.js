import React from 'react';

import PandaBridge from 'pandasuite-bridge';
import { usePandaBridge } from 'pandasuite-bridge-react';

import { useSetRecoilState } from 'recoil';

import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import map from 'lodash/map';

import { Document } from 'flexsearch';

import SearchPattern from './SearchPattern';
import patternAtom from '../../atoms/Pattern';

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
  const queryable = { results: r };

  PandaBridge.send('results', [queryable]);
  PandaBridge.send(PandaBridge.UPDATED, {
    queryable,
  });
};

function Search() {
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
    boost: () => key.weight,
  }));

  const index = new Document({
    document: {
      id: 'id', index: field, store: true, worker: true,
    },
  });
  docsFromSource(source).forEach((d) => {
    index.add(d);
  });

  return (
    <SearchPattern
      index={index}
      onResults={triggerEvents}
    />
  );
}

export default Search;
