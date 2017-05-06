import AppDispatcher from '../../common/dispatcher/AppDispatcher';
import {EventEmitter} from 'events';

//constants
import {ActionTypes, CHANGE_EVENT} from '../../common/constants/AppConstants';

// actions
import RestorePasswordActionCreators from './RestorePassword.actionCreators';

//utils
import Joi from 'joi';

const _schema = {
  phone: Joi.string().regex(/^\d+$/).min(10).max(15).required()
};

function _getInitialState() {
  return {
    fields: [{
      name: 'phone',
      type: 'tel',
      value: '',
      label: 'RestorePassword.phone.label',
      placeholder: 'RestorePassword.phone.label',
      isValid: false,
      validationState: null,
      hint: null
    }],
    loading: false,
    hasServerResponse: false
  };
}

let _state = _getInitialState();

let RestorePasswordStore = Object.assign({}, EventEmitter.prototype, {
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
    return Joi.validate(value, schema, (err) => {
      field.isValid = !err;
      field.validationState = 'success';
      field.hint = null;

      if(err) {

	switch (field.name) {
	  case 'phone':
	    if (err.details[0].type === 'any.empty') {
		field.hint = 'RestorePassword.phone.hints.0';
	    } else {
	      field.hint = 'RestorePassword.phone.hints.1';
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

RestorePasswordStore.dispatchToken = AppDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.RESTORE_PASSWORD_FIELD_CHANGE:
      _state.fields.forEach((item) => {
	if (item.name === action.field) {
	  item.value = action.value;
	  RestorePasswordStore.validate(item.name);
	}
      });
      _state.hasServerResponse = false;
      RestorePasswordStore.emitChange();
      break;
      
    case ActionTypes.RESTORE_PASSWORD_REQUEST_START:
      _state.loading = true;
      RestorePasswordStore.emitChange();
      break;

    case ActionTypes.RESTORE_PASSWORD_FAIL:
      _state.fields.forEach((item) => {
	if (item.name === action.data.field) {
	  item.validationState = action.data.validationState;
	  item.hint = action.data.hint;
	}
      });
      _state.loading = false;
      _state.hasServerResponse = true;
      RestorePasswordStore.emitChange();
      break;

    case ActionTypes.RESTORE_PASSWORD_SUCCESS:
      _state.loading = false;
      _state.fields.forEach((item) => {
	if (action.data) {
	  item.value = '';
	  item.validationState = action.data.validationState;
	  item.hint = action.data.hint;
	}
      });
      RestorePasswordStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default RestorePasswordStore;