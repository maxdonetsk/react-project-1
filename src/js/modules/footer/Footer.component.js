import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class Footer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
	<Grid>
	  <Row>
	    <Col xs={12}>
	    <Panel>
	      Footer goes here.
	    </Panel>
	    </Col>
	  </Row>
	</Grid>
    );
  }
}

export default Footer;