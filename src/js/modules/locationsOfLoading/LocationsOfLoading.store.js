import AppDispatcher from '../../common/dispatcher/AppDispatcher';
import {EventEmitter} from 'events';

//constants
import {ActionTypes,
	CHANGE_EVENT,
	BASE_PRIVATE_URL,
	AUTHENTICATION_COOKIE_NAME,
	Routes,
	Flashes} from '../../common/constants/AppConstants';

// actions
import LocationsOfLoadingActionCreators from './LocationsOfLoading.actionCreators';

//utils
import Joi from 'joi';
import cloneDeep from 'lodash/cloneDeep';

const _schema = {
  name: Joi.string().required(),
  daily_capacity: Joi.number().min(0.1).required(),
  shipment_type: Joi.number(),
  has_scales: Joi.number(),
  shipment_on_bad_weather: Joi.number(),
  restrictions_for_transport: Joi.string().allow('')
};

const defaultFields = [{
  name: 'name',
  type: 'text',
  value: '',
  label: 'LocationsOfLoading.fields.name.label',
  placeholder: 'LocationsOfLoading.fields.name.label',
  isValid: false,
  validationState: null,
  hint: null
},
{
  name: 'daily_capacity',
  type: 'number',
  value: 0.1,
  min: 0.01,
  step: 0.01,
  label: 'LocationsOfLoading.fields.dailyCapacity.label',
  isValid: true,
  validationState: null,
  hint: null
},
{
  name: 'shipment_type',
  type: 'select',
  value: 1,
  label: 'LocationsOfLoading.fields.loadingType.label',
  isValid: true,
  validationState: null,
  hint: null
}, 
{
  name: 'has_scales',
  type: 'checkbox',
  value: 0,
  checked: false,
  label: 'LocationsOfLoading.fields.hasScales.label',
  isValid: true,
},
{
  name: 'shipment_on_bad_weather',
  type: 'checkbox',
  value: 0,
  checked: false,
  label: 'LocationsOfLoading.fields.badWeatherLoading.label',
  isValid: true,
},
{
  name: 'restrictions_for_transport',
  type: 'textarea',
  value: '',
  label: 'LocationsOfLoading.fields.restrictionsForTransport.label',
  placeholder: 'LocationsOfLoading.fields.restrictionsForTransport.label',
  isValid: true,
  validationState: null,
  hint: null
}];

function _getInitialState() {
  return {
    addLocationMode: false,
    loading: {
      add: false,
      update: false,
      delete: false,
      currentLocationOfLoading: false,
      locationsOfLoadingTypes: true,
      locationsOfLoadingItems: true
    },
    hasServerResponse: false,
    locationsOfLoadingTypes: null,
    locationsOfLoadingItems: [],
    currentLocationOfLoading: cloneDeep(defaultFields),
    currentLocationOfLoadingName: '',
    fields: cloneDeep(defaultFields),
    flash: {
      state: null,
      message: null
    },
    showModal: false
  };
}

let _state = _getInitialState();

let LocationsOfLoadingStore = Object.assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getState() {
    return _state;
  },

  validate(fieldName, isCurrent) {
    const field = isCurrent ? _state.currentLocationOfLoading.find((item) => item.name === fieldName) : _state.fields.find((item) => item.name === fieldName);
    let value = {};
    let schema = {};
    value[field.name] = field.value;
    schema[field.name] = _schema[field.name];
    return Joi.validate(value, schema, (err) => {
      field.isValid = !err;
      field.validationState = 'success';
      field.hint = null;

      if(err) {
	field.validationState = 'error';

	switch (field.name) {
	  case 'name':
	    if (err.details[0].type === 'any.empty') {
		field.hint = 'LocationsOfLoading.fields.name.hints.0';
	    }
	    
	    break;

	  case 'daily_capacity':
	    if (err.details[0].type === 'number.base' || err.details[0].type === 'number.min') {
		field.hint = 'LocationsOfLoading.fields.dailyCapacity.hints.0';
	    }
	    break;

	  default:
	    break;
	}
      }

      return !err;
    });
   }
});

LocationsOfLoadingStore.dispatchToken = AppDispatcher.register(action => {

  switch (action.type) {
    case ActionTypes.GET_LOCATIONS_OF_LOADING_TYPES_REQUEST_START:
      _state.loading.locationsOfLoadingTypes = true;
      LocationsOfLoadingStore.emitChange();
      break;

    case ActionTypes.GET_LOCATIONS_OF_LOADING_TYPES_REQUEST_END:
      _state.loading.locationsOfLoadingTypes = false;
      _state.locationsOfLoadingTypes = action.data;
      LocationsOfLoadingStore.emitChange();
      break;
      
    case ActionTypes.GET_LOCATIONS_OF_LOADING_REQUEST_START:
      _state.loading.locationsOfLoadingItems = true;
      LocationsOfLoadingStore.emitChange();
      break;

    case ActionTypes.GET_LOCATIONS_OF_LOADING_REQUEST_END:
      _state.loading.locationsOfLoadingItems = false;
      _state.locationsOfLoadingItems = action.data;
      LocationsOfLoadingStore.emitChange();
      break;

    case ActionTypes.GET_LOCATION_OF_LOADING_REQUEST_START:
      _state.loading.currentLocationOfLoading = true;
      LocationsOfLoadingStore.emitChange();
      break;

    case ActionTypes.GET_LOCATION_OF_LOADING_REQUEST_END:
      _state.loading.currentLocationOfLoading = false;
      if (action.data) {
	_state.currentLocationOfLoading.map(item => {
	  if (action.data.hasOwnProperty(item.name)) {
	    item.value = action.data[item.name];
	    item.isValid = true;
	    if (item.hasOwnProperty('checked')) {
	      item.checked = (item.value === 1);
	    }
	  }
	});
	_state.currentLocationOfLoadingName = action.data.name;
      }
      LocationsOfLoadingStore.emitChange();
      break;

    case ActionTypes.UPDATE_LOCATION_OF_LOADING_REQUEST_START:
      _state.loading.update = true;
      LocationsOfLoadingStore.emitChange();
      break;

    case ActionTypes.UPDATE_LOCATION_OF_LOADING_REQUEST_END:
      _state.loading.update = false;
      if (action.data) {
	_state.currentLocationOfLoadingName = action.data.name;
	_state.flash.state = Flashes.SUCCESS;
	_state.flash.message = 'LocationsOfLoading.flashMessages.updated.success';
      }
      LocationsOfLoadingStore.emitChange();
      break;
      
    case ActionTypes.DELETE_LOCATION_OF_LOADING_REQUEST_START:
      _state.loading.delete = true;
      LocationsOfLoadingStore.emitChange();
      break;

    case ActionTypes.DELETE_LOCATION_OF_LOADING_REQUEST_END:
      _state.loading.delete = false;
      if (action.data) {
	_state.flash.state = Flashes.SUCCESS;
	_state.flash.message = 'LocationsOfLoading.flashMessages.deleted.success';
      }
      LocationsOfLoadingStore.emitChange();
      break;

    case ActionTypes.ADD_LOCATION_OF_LOADING_BUTTON_CLICK:
      _state.addLocationMode = true;
      LocationsOfLoadingStore.emitChange();
      break;

    case ActionTypes.LOCATIONS_OF_LOADING_FIELD_CHANGE:
      const fields = action.data.isCurrent ? _state.currentLocationOfLoading : _state.fields;
      fields.forEach((item) => {
	if (item.name === action.data.field) {
	  if (action.data.type === 'checkbox') {
	    item.checked = action.data.value;
	    item.value = item.checked ? 1 : 0;
	  } else {
	    item.value = action.data.value;
	    LocationsOfLoadingStore.validate(item.name, action.data.isCurrent);
	  }
	}
      });
      _state.hasServerResponse = false;
      LocationsOfLoadingStore.emitChange();
      break;

    case ActionTypes.ADD_LOCATION_OF_LOADING_RESET:
      _state.addLocationMode = false;
      _state.fields = cloneDeep(defaultFields);
      LocationsOfLoadingStore.emitChange();
      break;
      
    case ActionTypes.ADD_LOCATION_OF_LOADING_REQUEST_START:
      _state.loading.add = true;
      LocationsOfLoadingStore.emitChange();
      break;
    
    case ActionTypes.ADD_LOCATION_OF_LOADING_FAIL:
      _state.fields.forEach((item) => {
	if (item.name === action.data.field) {
	  item.validationState = action.data.validationState;
	  item.hint = action.data.hint;
	}
      });
      _state.loading.add = false;
      _state.hasServerResponse = true;
      LocationsOfLoadingStore.emitChange();
      break;

    case ActionTypes.ADD_LOCATION_OF_LOADING_SUCCESS:
      _state.loading.add = false;
      _state.addLocationMode = false;
      _state.flash.state = Flashes.SUCCESS;
      _state.flash.message = 'LocationsOfLoading.flashMessages.added.success';
      _state.fields = cloneDeep(defaultFields);
      LocationsOfLoadingStore.emitChange();
      break;

    case ActionTypes.RESET_FLASH_MESSAGE:
      _state.flash.state = null;
      _state.flash.message = null;
      LocationsOfLoadingStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default LocationsOfLoadingStore;