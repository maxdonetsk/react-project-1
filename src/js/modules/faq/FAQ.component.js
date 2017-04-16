import React from 'react';

//react-bootstrap
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Breadcrumb from 'react-bootstrap/lib/Breadcrumb';

//constants
import {PROJECT_NAME,
	DEFAULT_LANGUAGE,
	AVAILABLE_LANGUAGES,
	USER_OBJECT_STORAGE_NAME,
	Routes} from '../../common/constants/AppConstants';

//utils
import i18n from '../../utils/i18n';

class FAQ extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid className='faq flex-1'>
	  <Row>
	    <Col xs={12}>
	      <Breadcrumb>
		<Breadcrumb.Item active>
		  {i18n.t('Footer.FAQ')}
		</Breadcrumb.Item>
	      </Breadcrumb>
	    </Col>
	  </Row>
	  <Row>
	    <Col xs={12}>
	      <div className='panel panel-default faq-panel'>
		<div className='panel-heading'>
		  1
		</div>
		<div className='panel-body'>
		  <Row>
		    <Col md={6} mdOffset={3}>
		      2
		    </Col>
		  </Row>
		</div>
	      </div>
	    </Col>
	  </Row>
	</Grid>
    );
  }
}

export default FAQ;