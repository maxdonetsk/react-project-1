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

//components
import Loading from '../../common/components/Loading.component';

// actions
import SignUpActionCreators from './SignUp.actionCreators';

// stores
import SignUpStore from './SignUp.store';

//utils
import bindAll from 'lodash/bindAll';
import i18n from '../../utils/i18n';

class SignUp extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, '_handleFieldChange', '_onChange', '_handleSubmit');
    this.state = this._getStateFromStores();
  }
  
  componentWillMount() {
    SignUpStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    SignUpStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(this._getStateFromStores);
  }
  
  _getStateFromStores() {
    return {
      ...SignUpStore.getState()
    };
  }

  _handleFieldChange(event) {
    SignUpActionCreators.changeField(event.target.name, event.target.value);
  }
  
  _handleSubmit(event) {
    event.preventDefault();
    const phone = this.state.fields.find((item) => item.name === 'phone');
    const data = {phone: phone.value};
    SignUpActionCreators.signUp(data);
  }

  render() {
    const phone = this.state.fields.find((item) => item.name === 'phone');
    const isEnabled = phone.isValid;
    const hasServerResponse = this.state.hasServerResponse;
    return (
      <Grid className='flex-1'>
	<Row className='text-center'>
	  <h1>{i18n.t('SignUp.title')}</h1>
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
		))}
		<div className='text-right'>
		  <Button type='submit' bsStyle='primary' disabled={!isEnabled || this.state.loading}>
		    {this.state.loading ? <Loading /> : i18n.t('SignUp.submit')}
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

export default SignUp;