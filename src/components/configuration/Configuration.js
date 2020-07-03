import React from 'react';

import PandaBridge from 'pandasuite-bridge';
import { usePandaBridge } from 'pandasuite-bridge-react';

import { useIntl } from 'react-intl';
import ReactJson from 'react-json-view';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useRecoilValue } from 'recoil';

import Keys from './Keys';
import resultsAtom from '../../atoms/Results';

function Configuration() {
  const { properties } = usePandaBridge();
  const intl = useIntl();
  const results = useRecoilValue(resultsAtom);

  if (properties === undefined || !PandaBridge.isStudio) {
    return null;
  }

  return (
    <Accordion defaultActiveKey="0">
      <Card>
        <Card.Header>
          <Accordion.Toggle className="text-left p-0" as={Button} variant="link" eventKey="0">
            {intl.formatMessage({ id: 'searchable.title' })}
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Keys />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Card.Header>
          <Accordion.Toggle className="text-left p-0" as={Button} variant="link" eventKey="1">
            {intl.formatMessage({ id: 'result.title' })}
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="1">
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
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

export default Configuration;
