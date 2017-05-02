import React from 'react';
import {NavLink} from 'react-router-dom';

//react-bootstrap
import Panel from 'react-bootstrap/lib/Panel';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Form from 'react-bootstrap/lib/Form';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Breadcrumb from 'react-bootstrap/lib/Breadcrumb';
import Table from 'react-bootstrap/lib/Table';
import Modal from 'react-bootstrap/lib/Modal';

//constants
import {USER_ID_COOKIE_NAME, USER_OBJECT_STORAGE_NAME, Routes} from '../../common/constants/AppConstants';

//components
import Loading from '../../common/components/Loading.component';
import FlashMessage from '../../common/components/FlashMessage.component';

// actions
import LocationsOfLoadingActionCreators from './LocationsOfLoading.actionCreators';

// stores
import LocationsOfLoadingStore from './LocationsOfLoading.store';
import UserStore from '../user/User.store';

//utils
import bindAll from 'lodash/bindAll';
import i18n from '../../utils/i18n';
import Utils from '../../utils/Utils';
import History from '../../utils/History';

class LocationsOfLoading extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, '_handleFieldChange', '_onChange', '_handleSubmit', '_handleReset',
	    '_getContent', '_showModal', '_hideModal', '_deleteLocation');
    this.state = this._getStateFromStores();
  }

  componentDidMount() {
    LocationsOfLoadingActionCreators.getLocationsOfLoadingTypes();
    LocationsOfLoadingActionCreators.getLocationsOfLoading();
    LocationsOfLoadingActionCreators.getLocationOfLoading(this.props.id);
    LocationsOfLoadingActionCreators.resetFlashMessage();
  }

  componentWillMount() {
    LocationsOfLoadingStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    LocationsOfLoadingStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(this._getStateFromStores);

    const currentId = +this.props.id;
    const currentLocation = this.state.locationsOfLoadingItems.find(item => item.id === currentId);
    if (!this.state.loading.locationsOfLoadingItems) {
      if (!currentLocation) {
	History.replace(Routes.LOCATIONS_OF_LOADING);
      }
    }
  }
  
  _getStateFromStores() {
    return {
      ...LocationsOfLoadingStore.getState(),
      user: UserStore.getUserInfo()
    };
  }

  _handleFieldChange(event) {
    LocationsOfLoadingActionCreators.changeField(event.target.type, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value, true);
  }

  _handleSubmit(event) {
    event.preventDefault();
    const name = this.state.currentLocationOfLoading.find((item) => item.name === 'name');
    const daily_capacity = this.state.currentLocationOfLoading.find((item) => item.name === 'daily_capacity');
    const shipment_type = this.state.currentLocationOfLoading.find((item) => item.name === 'shipment_type');
    const has_scales = this.state.currentLocationOfLoading.find((item) => item.name === 'has_scales');
    const shipment_on_bad_weather = this.state.currentLocationOfLoading.find((item) => item.name === 'shipment_on_bad_weather');
    const restrictions_for_transport = this.state.currentLocationOfLoading.find((item) => item.name === 'restrictions_for_transport');
    const data = {
      name: name.value,
      daily_capacity: +daily_capacity.value,
      shipment_type: +shipment_type.value,
      has_scales: +has_scales.value,
      shipment_on_bad_weather : +shipment_on_bad_weather.value,
      restrictions_for_transport: restrictions_for_transport.value
    };
    LocationsOfLoadingActionCreators.updateLocationOfLoading(data, this.props.id);
    setTimeout(() => {
      LocationsOfLoadingActionCreators.resetFlashMessage();
    }, 3000)
  }

  _handleReset() {
    LocationsOfLoadingActionCreators.addLocationOfLoadingReset();
  }
  
  _onAddClick() {
    LocationsOfLoadingActionCreators.onAddClick();
  }

  _showModal() {
    this.setState({showModal: true});
  }

  _hideModal() {
    this.setState({showModal: false});
  }
  
  _deleteLocation() {
    LocationsOfLoadingActionCreators.deleteLocationOfLoading(this.props.id);
  }

  _getContent() {
    const hasServerResponse = this.state.hasServerResponse;
    const user = this.state.user;
    const name = this.state.currentLocationOfLoading.find((item) => item.name === 'name');
    const daily_capacity = this.state.currentLocationOfLoading.find((item) => item.name === 'daily_capacity');
    const shipment_type = this.state.currentLocationOfLoading.find((item) => item.name === 'shipment_type');
    const has_scales = this.state.currentLocationOfLoading.find((item) => item.name === 'has_scales');
    const shipment_on_bad_weather = this.state.currentLocationOfLoading.find((item) => item.name === 'shipment_on_bad_weather');
    const restrictions_for_transport = this.state.currentLocationOfLoading.find((item) => item.name === 'restrictions_for_transport');
    const isEnabled = name.isValid && daily_capacity.isValid && shipment_type.isValid && has_scales.isValid && shipment_on_bad_weather.isValid && restrictions_for_transport.isValid;
    if (this.state.loading.currentLocationOfLoading) {
      return (
	<div className='loading-theme text-center'>
	  <Loading />
	</div>
      )
    }
    return (
      <div>
	<Form
	  onSubmit={this._handleSubmit}
	  onReset={this._handleReset}>
	  {this.state.currentLocationOfLoading.map((item, index) => {
	    return (
	    <div key={index}>
	      {item.type === 'text' && (
		<FormGroup
		  key={index}
		  controlId={item.name}
		  validationState={item.validationState}>
		  <ControlLabel>{i18n.t(item.label)}</ControlLabel>
		  <FormControl
		    type={item.type}
		    value={item.value}
		    name={item.name}
		    placeholder={i18n.t(item.placeholder)}
		    onChange={event => this._handleFieldChange(event)} />
		  <FormControl.Feedback />
		  <HelpBlock>{hasServerResponse ? (
		      item.hint
		    ) : (
		      i18n.t(item.hint)
		    )}
		  </HelpBlock>
		</FormGroup>
	      )}
	      {item.type === 'number' && (
		<FormGroup
		  key={index}
		  controlId={item.name}
		  validationState={item.validationState}>
		  <ControlLabel>{i18n.t(item.label)}</ControlLabel>
		  <FormControl
		    type={item.type}
		    value={item.value}
		    min={item.min ? item.min : null}
		    max={item.max ? item.max : null}
		    step={item.step ? item.step : null}
		    name={item.name}
		    onChange={event => this._handleFieldChange(event)} />
		  <FormControl.Feedback />
		  <HelpBlock>{hasServerResponse ? (
		      item.hint
		    ) : (
		      i18n.t(item.hint)
		    )}
		  </HelpBlock>
		</FormGroup>
	      )}
	      {item.type === 'select' && (
		<FormGroup
		  key={index}
		  controlId='type'>
		  <ControlLabel>{i18n.t(item.label)}</ControlLabel>
		  <FormControl
		    componentClass='select'
		    value={item.value}
		    name={item.name}
		    disabled={!this.state.locationsOfLoadingTypes}
		    onChange={event => this._handleFieldChange(event)}>
		    {(item.name === 'shipment_type' && this.state.locationsOfLoadingTypes) && (
		      this.state.locationsOfLoadingTypes.map((type) => {
			return (
			<option
			  value={type.id}
			  key={type.id}>{type.name}
			</option>
		      )})
		    )}
		  </FormControl>
		</FormGroup>
	      )}
	      {item.type === 'checkbox' && (
		<Checkbox
		  key={index}
		  value={item.value}
		  name={item.name}
		  checked={item.checked}
		  onChange={event => this._handleFieldChange(event)}>
		  {i18n.t(item.label)}
		</Checkbox>
	      )}
	      {item.type === 'textarea' && (
		<FormGroup
		  key={index}
		  controlId={item.name}
		  validationState={item.validationState}>
		  <ControlLabel>{i18n.t(item.label)}</ControlLabel>
		  <FormControl
		    className='resize-vertical'
		    componentClass={item.type}
		    value={item.value}
		    name={item.name}
		    placeholder={i18n.t(item.placeholder)}
		    onChange={event => this._handleFieldChange(event)} />
		  <FormControl.Feedback />
		  <HelpBlock>{hasServerResponse ? (
		      item.hint
		    ) : (
		      i18n.t(item.hint)
		    )}
		  </HelpBlock>
		</FormGroup>
	      )}
	    </div>
	  )})}

	{(Utils.getCookieItem(USER_ID_COOKIE_NAME) === user.profile[USER_ID_COOKIE_NAME]) &&
	  <div>
	    <Button type='submit' bsStyle='primary' disabled={!isEnabled || this.state.loading.update}>
	      {this.state.loading.update ? <Loading /> : i18n.t('LocationsOfLoading.update')}
	    </Button>
	    <Button type='button' bsStyle='danger' disabled={this.state.loading.delete} onClick={this._showModal}>
	      {this.state.loading.delete ? <Loading /> : i18n.t('LocationsOfLoading.delete')}
	    </Button>
	    {this.state.flash.message && (
	      <FlashMessage
		message={i18n.t(this.state.flash.message)}
		state={this.state.flash.state} />
	    )}
	  </div>
	}
	</Form>
	<Modal
	  show={this.state.showModal}
	  onHide={this._hideModal}
	  bsSize='small'
	  className='danger'>
	  <Modal.Header closeButton>
	    <Modal.Title>{i18n.t('LocationsOfLoading.modals.delete.title')}</Modal.Title>
	  </Modal.Header>
	  <Modal.Body>
	    <p>{i18n.t('LocationsOfLoading.modals.delete.body.0', {id: this.props.id})}</p>
	    <p>{i18n.t('LocationsOfLoading.modals.delete.body.1', {name: this.state.currentLocationOfLoadingName})}</p>
	  </Modal.Body>
	  <Modal.Footer>
	    <Button
	      bsStyle='danger'
	      onClick={this._deleteLocation}>{i18n.t('LocationsOfLoading.modals.delete.confirm')}
	    </Button>
	    <Button onClick={this._hideModal}>{i18n.t('LocationsOfLoading.modals.delete.decline')}</Button>
	  </Modal.Footer>
	</Modal>
      </div>
    )
  }

  render() {
    return (
      <Grid className='locations-of-loading flex-1'>
	<Row>
	  <Col xs={12}>
	    <Breadcrumb>
	      <li><NavLink to={Routes.LOCATIONS_OF_LOADING}>{i18n.t('Header.LocationsOfLoading')}</NavLink></li>
	      <Breadcrumb.Item active>
		{this.state.currentLocationOfLoadingName}
	      </Breadcrumb.Item>
	    </Breadcrumb>
	  </Col>
	</Row>
	<Row>
	  <Col xs={12}>
	    <Panel
	      header={this.state.currentLocationOfLoadingName}
	      className='locations-of-loading-panel'>
	      <Row>
		<Col md={6} mdOffset={3}>
		  {this._getContent()}
		</Col>
	      </Row>
	    </Panel>
	  </Col>
	</Row>
      </Grid>
    );
  }
}

export default LocationsOfLoading;