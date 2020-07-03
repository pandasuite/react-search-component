import React from 'react';

import { usePandaBridge } from 'pandasuite-bridge-react';

import ReactJson from 'react-json-view';
import { useIntl } from 'react-intl';

import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import filter from 'lodash/filter';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';

import { FaTrashAlt } from 'react-icons/fa';

function sourceToSchema(source) {
  // return source[random(0, source.length - 1)];
  return source[0];
}

function schemaFromSource(source) {
  if (isObject(source) && source.type === 'Collection') {
    return sourceToSchema(source.value);
  }

  if (isArray(source)) {
    return sourceToSchema(source);
  }

  return {};
}

function Keys() {
  const { properties, setProperty } = usePandaBridge();
  const intl = useIntl();

  if (properties === undefined) {
    return null;
  }

  const { source, keys: oriKeys } = properties;
  const keys = oriKeys || [];

  const handleSelect = (e) => {
    const keyName = filter(
      e.namespace.concat([e.name]),
      (name) => parseInt(name).toString() !== name,
    );

    const key = {
      name: keyName,
      weight: 1,
    };

    if (!find(keys, (existingKey) => isEqual(existingKey, key))) {
      setProperty('keys', keys.concat([key]));
    }
  };

  const onDelete = (keyIndex) => () => {
    const newKeys = keys.slice();
    newKeys.splice(keyIndex, 1);
    setProperty('keys', newKeys);
  };

  const onWeightChange = (keyIndex) => (event) => {
    const newKeys = keys.slice();
    newKeys[keyIndex].weight = Math.max(parseInt(event.target.value) || 1, 0);
    // eslint-disable-next-line no-param-reassign
    event.target.value = newKeys[keyIndex].weight;
    setProperty('keys', newKeys);
  };

  return (
    <>
      <ul className="list-group mb-2">
        {keys.map((key, index) => (
          <li key={key.name[key.name.length - 1]} className="list-group-item d-flex justify-content-between small" style={{ alignItems: 'center' }}>
            <p className="p-0 m-0 flex-grow-1">{key.name[key.name.length - 1]}</p>
            <input type="text" style={{ width: '30px' }} defaultValue={key.weight} onBlur={onWeightChange(index)} />
            <button type="button" className="btn btn-xs btn-default p-0" onClick={onDelete(index)}>
              <FaTrashAlt className="small" />
            </button>
          </li>
        ))}
      </ul>
      <p style={{ lineHeight: 1.2 }}>
        <small className="font-weight-light font-italic">
          {intl.formatMessage({ id: 'searchable.example.item.description' })}
        </small>
      </p>
      <ReactJson
        src={schemaFromSource(source)}
        name={false}
        onAdd={false}
        onEdit={false}
        onDelete={false}
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
        onSelect={handleSelect}
      />
    </>
  );
}

export default Keys;
