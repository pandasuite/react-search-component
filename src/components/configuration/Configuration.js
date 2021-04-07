import React, { useState } from 'react';

import PandaBridge from 'pandasuite-bridge';
import { usePandaBridge } from 'pandasuite-bridge-react';

import { useIntl } from 'react-intl';
import ReactJson from 'react-json-view';
import { useRecoilValue } from 'recoil';

import Keys from './Keys';
import SearchInput from './SearchInput';
import resultsAtom from '../../atoms/Results';

function Configuration() {
  const { properties } = usePandaBridge();
  const intl = useIntl();
  const results = useRecoilValue(resultsAtom);
  const [isConfTab, setConfTab] = useState(true);

  if (properties === undefined || !PandaBridge.isStudio) {
    return null;
  }

  const haveResults = results && results.length > 0;

  return (
    <div className="relative">
      <div className="flex">
        <button type="button" className={`border-t-2 m-1 mt-0 p-1 focus:outline-none ${isConfTab ? 'border-indigo-600' : 'border-white'}`} onClick={() => { setConfTab(true); }}>
          <span className={`uppercase font-sans text-base pt-2.5 ${isConfTab ? 'text-gray-700' : 'text-gray-400'}`}>{intl.formatMessage({ id: 'searchable.title' })}</span>
        </button>
        <button type="button" className={`border-t-2 m-1 mt-0 p-1 focus:outline-none ${!isConfTab ? 'border-indigo-600' : 'border-white'}`} onClick={() => { setConfTab(false); }}>
          <span className={`uppercase font-sans text-base pt-2.5 ${!isConfTab ? 'text-gray-700' : 'text-gray-400'}`}>{intl.formatMessage({ id: 'result.title' })}</span>
        </button>
      </div>
      <div className="px-2 pb-2.5">
        {isConfTab
          ? (
            <Keys />
          )
          : (
            <>
              <SearchInput />
              {haveResults && (
                <>
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing
                      {' '}
                      <span className="font-medium">{results.length}</span>
                      {' '}
                      results
                    </p>
                  </div>
                  <ReactJson
                    src={results}
                    name={false}
                    onAdd={false}
                    onEdit={false}
                    onDelete={false}
                    enableClipboard={false}
                    displayObjectSize={false}
                    displayDataTypes={false}
                  />
                </>
              )}
            </>
          )}
      </div>
    </div>
  );
}

export default Configuration;
