import React from 'react';

import { usePandaBridge } from 'pandasuite-bridge-react';

import ReactJson from 'react-json-view';
import { useIntl } from 'react-intl';

import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import filter from 'lodash/filter';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';

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
    const newKeys = cloneDeep(keys);
    newKeys[keyIndex].weight = Math.max(parseInt(event.target.value) || 1, 0);
    // eslint-disable-next-line no-param-reassign
    event.target.value = newKeys[keyIndex].weight;
    setProperty('keys', newKeys);
  };

  const schema = schemaFromSource(source);
  const showSourceInfo = isEmpty(schema);
  const showKeysInfo = !showSourceInfo && (!keys || keys.length === 0);

  return (
    <>
      <div className="flex flex-col">
        <div>
          <div className="align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <tbody className="bg-white divide-y divide-gray-200">
                  {keys.map((key, index) => (
                    <tr>
                      <td className="w-3/4 px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex flex-col">
                            <div className="flex text-sm text-gray-500 divide-x shadow-sm">
                              {key.name.map((name, i) => {
                                if (key.name.length - 1 === i) {
                                  return (
                                    <div className="flex-1 p-1 px-2 text-indigo-600">{name}</div>
                                  );
                                }
                                return (
                                  <div className="flex-1 p-1 px-2">{name}</div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-0 flex-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                          </svg>
                          <input type="number" className="w-10 ml-2 flex-1 border text-right rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent" defaultValue={key.weight} onBlur={onWeightChange(index)} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button type="button" className="text-indigo-600 hover:text-indigo-900 focus:outline-none" onClick={onDelete(index)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showKeysInfo && (
      <div className="flex bg-blue-50 rounded-lg p-5 text-base text-blue-600 place-items-center font-light">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-60" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        {intl.formatMessage({ id: 'searchable.example.item.description' })}
      </div>
      )}
      {showSourceInfo && (
      <div className="flex bg-blue-50 rounded-lg p-5 text-base text-blue-600 place-items-center font-light">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-60" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        {intl.formatMessage({ id: 'searchable.example.source.description' })}
      </div>
      )}
      {!showSourceInfo && (
      <div className="mt-5">
        <ReactJson
          src={schema}
          name={false}
          onAdd={false}
          onEdit={false}
          onDelete={false}
          enableClipboard={false}
          displayObjectSize={false}
          displayDataTypes={false}
          onSelect={handleSelect}
        />
      </div>
      )}
    </>
  );
}

export default Keys;
