import React from 'react';
import PropTypes from 'prop-types';

import PandaBridge from 'pandasuite-bridge';
import { usePandaBridge } from 'pandasuite-bridge-react';
import { useIntl } from 'react-intl';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import Keys from './Keys';
import Results from './Results';

function Search(props) {
  const { pattern } = props;
  const { properties } = usePandaBridge();
  const intl = useIntl();

  if (properties === undefined) {
    return null;
  }

  if (PandaBridge.isStudio) {
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
            <Results pattern={pattern} debug />
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }

  return (
    <Results pattern={pattern} />
  );
}

Search.propTypes = {
  pattern: PropTypes.string.isRequired,
};

export default Search;
