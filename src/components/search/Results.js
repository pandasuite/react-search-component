import React from 'react';
import PropTypes from 'prop-types';

import PandaBridge from 'pandasuite-bridge';
import { usePandaBridge } from 'pandasuite-bridge-react';

import Fuse from 'fuse.js';
import ReactJson from 'react-json-view';

import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

function listFromSource(source) {
  if (isObject(source) && source.type === 'Collection') {
    return source.value;
  }

  if (isArray(source)) {
    return source;
  }

  return [];
}

function Results(props) {
  const { properties } = usePandaBridge();
  const { pattern, debug } = props;

  if (properties === undefined) {
    return null;
  }

  const { isCaseSensitive, threshold, useExtendedSearch } = properties;

  const fuse = new Fuse(
    listFromSource(properties.source),
    {
      keys: properties.keys || [],
      isCaseSensitive,
      threshold,
      useExtendedSearch,
    },
  );

  const results = fuse.search(pattern);
  PandaBridge.send('newSearchResults', [isEmpty(pattern) ? null : results]);

  if (debug) {
    return (
      <ReactJson
        src={results.map((row) => row.item)}
        name={false}
        onAdd={false}
        onEdit={false}
        onDelete={false}
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
      />
    );
  }
  return null;
}

Results.defaultProps = {
  debug: false,
};

Results.propTypes = {
  pattern: PropTypes.string.isRequired,
  debug: PropTypes.bool,
};

export default Results;
