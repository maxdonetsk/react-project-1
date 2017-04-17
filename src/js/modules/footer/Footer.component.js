import React from 'react';
import {Route, Redirect} from 'react-router';
import {NavLink} from 'react-router-dom';

//react-bootstrap
import Panel from 'react-bootstrap/lib/Panel';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

//constants
import {PROJECT_NAME, Routes} from '../../common/constants/AppConstants';

//utils
import i18n from '../../utils/i18n';

class Footer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
	<Grid id='footer'>
	  <Row>
	    <Col xs={12}>
	      <Panel>
		<Row>
		  <div className='footer-column pull-left'>
		    &copy; {`${PROJECT_NAME}, ${new Date().getFullYear()}`}
		  </div>
		  <div className='footer-column pull-left'>
		    <div className='footer-link-item'>
		      <NavLink to={Routes.FAQ}>{i18n.t('Footer.FAQ')}</NavLink>
		    </div>
		  </div>
		</Row>
	      </Panel>
	    </Col>
	  </Row>
	</Grid>
    );
  }
}

export default Footer;