import React from 'react';
import {Link} from 'react-router-dom';

//react-bootstrap
import Panel from 'react-bootstrap/lib/Panel';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Form from 'react-bootstrap/lib/Form';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Button from 'react-bootstrap/lib/Button';
import Alert from 'react-bootstrap/lib/Alert';

//constants
import {Routes} from '../../common/constants/AppConstants';

//components
import Loading from '../../common/components/Loading.component';

//actions
import SignInActionCreators from './SignIn.actionCreators';

// stores
import SignInStore from './SignIn.store';

//utils
import bindAll from 'lodash/bindAll';
import i18n from '../../utils/i18n';

class SignIn extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, '_handleFieldChange', '_onChange', '_handleSubmit');
    this.state = this._getStateFromStores();
  }
  
  componentWillMount() {
    SignInStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    SignInStore.removeChangeListener(this._onChange);
  }
  _onChange() {
    this.setState(this._getStateFromStores);
  }
  
  _getStateFromStores() {
    return {
      ...SignInStore.getState()
    };
  }

  _handleFieldChange(event) {
    SignInActionCreators.changeField(event.target.name, event.target.value);
  }
  
  _handleSubmit(event) {
    event.preventDefault();
    const phone = this.state.fields.find((item) => item.name === 'phone');
    const password = this.state.fields.find((item) => item.name === 'password');
    const data = {
      phone: phone.value,
      password: password.value
    };
    SignInActionCreators.signIn(data);
  }

  render() {
    const phone = this.state.fields.find((item) => item.name === 'phone');
    const password = this.state.fields.find((item) => item.name === 'password');
    const isEnabled = phone.isValid && password.isValid;
    const hasServerResponse = this.state.hasServerResponse;
    return (
	<Grid className='flex-1'>
	  <Row className='text-center'>
	    <Col md={6} mdOffset={3}>
	      <h1>{i18n.t('SignIn.title')}</h1>
	      {(this.state.alert.isVisible && this.state.alert.type === 'sign-up-success') &&
		<Alert bsStyle='success'>
		  <h4>{i18n.t('SignIn.alerts.afterSignUp.0')}</h4>
		  <p>{i18n.t('SignIn.alerts.afterSignUp.1')}</p>
		</Alert>
	      }
	    </Col>
	  </Row>
	  <Row>
	    <Col md={6} mdOffset={3}>
	      <Panel>
		<Form onSubmit={this._handleSubmit}>
		  {this.state.fields.map((field, index) => (
		    <div key={index * 10}>
		      {field.name === 'phone' ? (
			<FormGroup
			  key={index}
			  controlId={field.name}
			  validationState={field.validationState}>
			  <ControlLabel>{i18n.t(field.label)}</ControlLabel>
			  <InputGroup>
			    <InputGroup.Addon>+</InputGroup.Addon>
			    <FormControl
			      type={field.type}
			      value={field.value}
			      name={i18n.t(field.name)}
			      placeholder={i18n.t(field.placeholder)}
			      onChange={event => this._handleFieldChange(event)} />
			  </InputGroup>
			  <FormControl.Feedback />
			  <HelpBlock>{hasServerResponse ? (
			      field.hint
			    ) : (
			      i18n.t(field.hint)
			    )}
			  </HelpBlock>
			</FormGroup>
			) : (
			<FormGroup
			  key={index}
			  controlId={field.name}
			  validationState={field.validationState}>
			  <ControlLabel>{i18n.t(field.label)}</ControlLabel>
			    <FormControl
			      type={field.type}
			      value={field.value}
			      name={i18n.t(field.name)}
			      placeholder={i18n.t(field.placeholder)}
			      onChange={event => this._handleFieldChange(event)} />
			  <FormControl.Feedback />
			  <HelpBlock>{hasServerResponse ? (
			      field.hint
			    ) : (
			      i18n.t(field.hint)
			    )}
			  </HelpBlock>
			</FormGroup>
		      )}
		    </div>
		  ))}
		  <div className='text-right'>
		    <Link to={Routes.RESTORE_PASSWORD} className='btn btn-link'>{i18n.t('SignIn.links.RestorePassword')}</Link>
		    <Button type='submit' bsStyle='primary' disabled={!isEnabled || this.state.loading}>
		      {this.state.loading ? <Loading /> : i18n.t('SignIn.submit')}
		    </Button>
		  </div>
		</Form>
	      </Panel>
	    </Col>
	  </Row>
	</Grid>
    );
  }
}

export default SignIn;