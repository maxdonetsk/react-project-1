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
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Breadcrumb from 'react-bootstrap/lib/Breadcrumb';
import Table from 'react-bootstrap/lib/Table';

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
	    '_getContent', '_handleLocationOfLoadingItemClick');
    this.state = this._getStateFromStores();
  }

  componentDidMount() {
    LocationsOfLoadingActionCreators.getLocationsOfLoading();
  }

  componentWillMount() {
    LocationsOfLoadingStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    LocationsOfLoadingStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(this._getStateFromStores);
  }
  
  _getStateFromStores() {
    return {
      ...LocationsOfLoadingStore.getState(),
      user: UserStore.getUserInfo()
    };
  }

  _handleFieldChange(event) {
    LocationsOfLoadingActionCreators.changeField(event.target.type, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value, false);
  }

  _handleSubmit(event) {
    event.preventDefault();
    const name = this.state.fields.find((item) => item.name === 'name');
    const daily_capacity = this.state.fields.find((item) => item.name === 'daily_capacity');
    const shipment_type = this.state.fields.find((item) => item.name === 'shipment_type');
    const has_scales = this.state.fields.find((item) => item.name === 'has_scales');
    const shipment_on_bad_weather = this.state.fields.find((item) => item.name === 'shipment_on_bad_weather');
    const restrictions_for_transport = this.state.fields.find((item) => item.name === 'restrictions_for_transport');
    const data = {
      name: name.value,
      daily_capacity: +daily_capacity.value,
      shipment_type: +shipment_type.value,
      has_scales: +has_scales.value,
      shipment_on_bad_weather : +shipment_on_bad_weather.value,
      restrictions_for_transport: restrictions_for_transport.value
    };
    LocationsOfLoadingActionCreators.addLocationOfLoadingSubmit(data);
    setTimeout(() => {
      LocationsOfLoadingActionCreators.resetFlashMessage();
    }, 3000);
  }

  _handleReset() {
    LocationsOfLoadingActionCreators.addLocationOfLoadingReset();
  }
  
  _onAddClick() {
    LocationsOfLoadingActionCreators.onAddClick();
  }

  _handleLocationOfLoadingItemClick(item) {
    History.push(Routes.LOCATIONS_OF_LOADING + '/' + item.id);
  }

  _getContent() {
    if (this.state.loading.locationsOfLoadingItems) {
      return (
	<div className='loading-theme text-center'>
	  <Loading />
	</div>
      )
    }
    if (this.state.locationsOfLoadingItems.length) {
      return (
	<Table responsive striped hover>
	  <thead>
	    <tr>
	      <th>ID</th>
	      <th>{i18n.t('LocationsOfLoading.table.name')}</th>
	      <th>{i18n.t('LocationsOfLoading.table.dailyCapacity')}</th>
	      <th>{i18n.t('LocationsOfLoading.table.loadingType')}</th>
	      <th>{i18n.t('LocationsOfLoading.table.hasScales')}</th>
	      <th>{i18n.t('LocationsOfLoading.table.badWeatherLoading')}</th>
	      <th>{i18n.t('LocationsOfLoading.table.restrictionsForTransport')}</th>
	    </tr>
	  </thead>
	  <tbody>
	    {this.state.locationsOfLoadingItems.map((item, index) => {
	      return (
		<tr
		  key={index}
		  onClick={this._handleLocationOfLoadingItemClick.bind(null, item)}>
		  <td>{item.id}</td>
		  <td>{item.name}</td>
		  <td>{item.daily_capacity}</td>
		  <td>{item.shipment_type_description}</td>
		  <td>{item.has_scales ? <Glyphicon glyph='ok' title={item.has_scales_description} /> : null}</td>
		  <td>{item.shipment_on_bad_weather ? <Glyphicon glyph='ok' title={item.shipment_on_bad_weather_description} /> : null}</td>
		  <td>{item.restrictions_for_transport}</td>
		</tr>
	      )})}
	  </tbody>
	</Table>
      )
    }
    return (
      !this.state.addLocationMode &&
	<div className='text-center'>
	  {i18n.t('LocationsOfLoading.NoData.0')}<br />
	    <Button type='button'
		    bsStyle='link'
		    onClick={this._onAddClick}>
	      {i18n.t('LocationsOfLoading.NoData.1')}
	    </Button>
	</div>
    )
  }

  render() {
    const user = this.state.user;
    const hasServerResponse = this.state.hasServerResponse;
    const name = this.state.fields.find((item) => item.name === 'name');
    const daily_capacity = this.state.fields.find((item) => item.name === 'daily_capacity');
    const shipment_type = this.state.fields.find((item) => item.name === 'shipment_type');
    const has_scales = this.state.fields.find((item) => item.name === 'has_scales');
    const shipment_on_bad_weather = this.state.fields.find((item) => item.name === 'shipment_on_bad_weather');
    const restrictions_for_transport = this.state.fields.find((item) => item.name === 'restrictions_for_transport');
    const isEnabled = name.isValid && daily_capacity.isValid && shipment_type.isValid && has_scales.isValid && shipment_on_bad_weather.isValid && restrictions_for_transport.isValid;
    return (
      <Grid className='locations-of-loading flex-1'>
	<Row>
	  <Col xs={12}>
	    <Breadcrumb>
	      <Breadcrumb.Item active>
		{i18n.t('Header.LocationsOfLoading')}
	      </Breadcrumb.Item>
	    </Breadcrumb>
	  </Col>
	</Row>
	<Row>
	  <Col xs={12}>
	    <div className='panel panel-default locations-of-loading-panel'>
	      <div className='panel-heading clearfix'>
		<div className='pull-left'>{i18n.t('LocationsOfLoading.header')}</div>
		{(Utils.getCookieItem(USER_ID_COOKIE_NAME) === user.profile[USER_ID_COOKIE_NAME] && !this.state.addLocationMode) &&
		  <div className='pull-right'>
		    {this.state.flash.message && (
		      <FlashMessage
			message={i18n.t(this.state.flash.message)}
			state={this.state.flash.state} />
		    )}
		    <Button type='button'
			    bsStyle='primary'
			    onClick={this._onAddClick}>
		      {i18n.t('LocationsOfLoading.addLocation')}
		    </Button>
		  </div>
		}
	      </div>
	      <div className='panel-body'>
		{this.state.addLocationMode &&
		  <Row>
		    <Col md={6} mdOffset={3}>
		      <Form
			onSubmit={this._handleSubmit}
			onReset={this._handleReset}>
			{this.state.fields.map((item, index) => {
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
			<div>
			  <Button type='submit' bsStyle='success' disabled={!isEnabled || this.state.loading.add}>
			    {this.state.loading.add ? <Loading /> : i18n.t('LocationsOfLoading.save')}
			  </Button>
			  <Button type='reset' bsStyle='default'>
			    {i18n.t('LocationsOfLoading.cancel')}
			  </Button>
			</div>
		      </Form>
		    </Col>
		  </Row>
		}
		<Row>
		  <Col xs={12}>
		    {this._getContent()}
		  </Col>
		</Row>
	      </div>
	    </div>
	  </Col>
	</Row>
      </Grid>
    )
  }
}

export default LocationsOfLoading;