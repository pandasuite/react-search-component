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

function typedResultsFromSource(r, source, sourceBind) {
  if (isObject(source) && source.type === 'Collection' && sourceBind) {
    return {
      type: 'References',
      schema: {
        path: {
          value: sourceBind,
        },
      },
      value: map(PandaBridge.isStudio ? source.value : r, (doc) => ({
        type: 'Reference',
        schema: {
          path: {
            value: sourceBind,
          },
        },
        value: doc.id,
      })),
    };
  }
  if (PandaBridge.isStudio && isArray(source)) {
    return source;
  }
  return r;
}

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
    keys, charset, tokenize, source, [PandaBridge.BINDABLE]: bindable,
  } = properties;
  const { source: sourceBind } = bindable || {};

  const triggerEvents = (r) => {
    const queryable = {
      results: typedResultsFromSource(r, source, sourceBind),
    };

    PandaBridge.send('results', [queryable]);
    PandaBridge.send(PandaBridge.UPDATED, {
      queryable,
    });
  };

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
