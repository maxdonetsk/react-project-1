import AppDispatcher from '../../common/dispatcher/AppDispatcher';
import {EventEmitter} from 'events';

//constants
import {ActionTypes, CHANGE_EVENT, Alerts} from '../../common/constants/AppConstants';

// actions
import UpdatePasswordActionCreators from './UpdatePassword.actionCreators';

//utils
import Joi from 'joi';

let newPassword = '';

const _schema = {
  old_password: Joi.string().required(),
  password: Joi.string().min(4).required(),
  password_repeat: Joi.string().min(4).required()
};

function _getInitialState() {
  return {
    fields: [{
      name: 'old_password',
      type: 'password',
      value: '',
      label: 'UpdatePassword.old_password.label',
      placeholder: 'UpdatePassword.old_password.label',
      isValid: false,
      validationState: null,
      hint: null
    },
    {
      name: 'password',
      type: 'password',
      value: '',
      label: 'UpdatePassword.password.label',
      placeholder: 'UpdatePassword.password.label',
      isValid: false,
      validationState: null,
      hint: null
    },
    {
      name: 'password_repeat',
      type: 'password',
      value: '',
      label: 'UpdatePassword.password_repeat.label',
      placeholder: 'UpdatePassword.password_repeat.label',
      isValid: false,
      validationState: null,
      hint: null
    }],
    loading: false,
    hasServerResponse: false,
    alert: {
      type: null,
      isVisible: false
    }
  };
}

let _state = _getInitialState();

let UpdatePasswordStore = Object.assign({}, EventEmitter.prototype, {
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
  
  validate(fieldName) {
    const field = _state.fields.find((item) => item.name === fieldName);
    let value = {};
    let schema = {};
    value[field.name] = field.value;
    schema[field.name] = _schema[field.name];
    if (field.name === 'password_repeat') {
      schema[field.name] = Joi.string().valid(newPassword);
    }
    return Joi.validate(value, schema, (err) => {
      field.isValid = !err;
      field.validationState = 'success';
      field.hint = null;

      if(err) {

	switch (field.name) {
	  case 'old_password':
	    if (err.details[0].type === 'any.empty') {
	      field.hint = 'UpdatePassword.old_password.hints.0';
	    }
	    field.validationState = 'error';
	    break;

	  case 'password':
	    if (err.details[0].type === 'any.empty') {
	      field.hint = 'UpdatePassword.password.hints.0';
	    }
	    if (err.details[0].type === 'string.min') {
	      field.hint = 'UpdatePassword.password.hints.1';
	    }
	    field.validationState = 'error';
	    break;

	  case 'password_repeat':
	    if (err.details[0].type === 'any.empty') {
	      field.hint = 'UpdatePassword.password_repeat.hints.0';
	    }
	    if (err.details[0].type === 'string.min') {
	      field.hint = 'UpdatePassword.password_repeat.hints.1';
	    }
	    if (err.details[0].type === 'any.allowOnly') {
	      field.hint = 'UpdatePassword.password_repeat.hints.2';
	    }
	    field.validationState = 'error';
	    break;

	  default:
	    break;
	}
      }

      return !err;
    });
   }
});

UpdatePasswordStore.dispatchToken = AppDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.UPDATE_PASSWORD_FIELD_CHANGE:
      if (action.field === 'password') {
	newPassword = action.value;
      }
      _state.fields.forEach((item) => {
	if (item.name === action.field) {
	  item.value = action.value;
	  UpdatePasswordStore.validate(item.name);
	}
      });
      _state.hasServerResponse = false;
      UpdatePasswordStore.emitChange();
      break;
      
    case ActionTypes.UPDATE_PASSWORD_REQUEST_START:
      _state.loading = true;
      UpdatePasswordStore.emitChange();
      break;

    case ActionTypes.UPDATE_PASSWORD_FAIL:
      action.data.forEach(item => {
	let currentItem = _state.fields.find(field => field.name === item.field);
	currentItem.hint = item.message;
	currentItem.validationState = 'error';
      });
      _state.loading = false;
      _state.hasServerResponse = true;
      UpdatePasswordStore.emitChange();
      break;

    case ActionTypes.UPDATE_PASSWORD_SUCCESS:
      _state = _getInitialState();
      _state.alert.type = Alerts.UPDATE_PASSWORD_SUCCESS;
      _state.alert.isVisible = true;
      UpdatePasswordStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default UpdatePasswordStore;