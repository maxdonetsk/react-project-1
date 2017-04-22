import React from 'react';

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

//components
import Loading from '../../common/components/Loading.component';

// actions
import UpdatePasswordActionCreators from './UpdatePassword.actionCreators';

// stores
import UpdatePasswordStore from './UpdatePassword.store';

//utils
import bindAll from 'lodash/bindAll';
import i18n from '../../utils/i18n';

class UpdatePassword extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, '_handleFieldChange', '_onChange', '_handleSubmit');
    this.state = this._getStateFromStores();
  }
  
  componentWillMount() {
    UpdatePasswordStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    UpdatePasswordStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(this._getStateFromStores);
  }
  
  _getStateFromStores() {
    return {
      ...UpdatePasswordStore.getState()
    };
  }

  _handleFieldChange(event) {
    UpdatePasswordActionCreators.changeField(event.target.name, event.target.value);
  }
  
  _handleSubmit(event) {
    event.preventDefault();
    const old_password = this.state.fields.find((item) => item.name === 'old_password');
    const password = this.state.fields.find((item) => item.name === 'password');
    const password_repeat = this.state.fields.find((item) => item.name === 'password_repeat');
    const data = {
      old_password: old_password.value,
      password: password.value,
      password_repeat: password_repeat.value
    };
    UpdatePasswordActionCreators.updatePassword(data);
  }

  render() {
    const old_password = this.state.fields.find((item) => item.name === 'old_password');
    const password = this.state.fields.find((item) => item.name === 'password');
    const password_repeat = this.state.fields.find((item) => item.name === 'password_repeat');
    const isEnabled = old_password.isValid && password.isValid && password_repeat.isValid;
    const hasServerResponse = this.state.hasServerResponse;
    return (
      <Grid className='flex-1'>
	<Row className='text-center'>
	  <Col md={6} mdOffset={3}>
	    <h1>{i18n.t('UpdatePassword.title')}</h1>
	    {(this.state.alert.isVisible && this.state.alert.type === 'password-changed') &&
	      <Alert bsStyle='success'>
		<h4>{i18n.t('UpdatePassword.alerts.afterPasswordUpdate.0')}</h4>
	      </Alert>
	    }
	  </Col>
	</Row>
	<Row>
	  <Col md={6} mdOffset={3}>
	  <Panel>
	    <Form onSubmit={this._handleSubmit}>
	      {this.state.fields.map((field, index) => (
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
	      ))}
	      <div className='text-right'>
		<Button type='submit' bsStyle='primary' disabled={!isEnabled || this.state.loading}>
		  {this.state.loading ? <Loading /> : i18n.t('UpdatePassword.submit')}
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

export default UpdatePassword;