import {EventEmitter} from 'events';

//constants
import {ActionTypes,
	CHANGE_EVENT,
	BASE_PRIVATE_URL,
	AUTHENTICATION_COOKIE_NAME,
	Routes} from '../../common/constants/AppConstants';
import AppDispatcher from '../../common/dispatcher/AppDispatcher';

// actions
import ChangePasswordActionCreators from './ChangePassword.actionCreators';

//utils
import Joi from 'joi';
import History from '../../utils/History';
import Utils from '../../utils/Utils';

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
      label: 'ChangePassword.old_password.label',
      placeholder: 'ChangePassword.old_password.label',
      isValid: false,
      validationState: null,
      hint: null
    },
    {
      name: 'password',
      type: 'password',
      value: '',
      label: 'ChangePassword.password.label',
      placeholder: 'ChangePassword.password.label',
      isValid: false,
      validationState: null,
      hint: null
    },
    {
      name: 'password_repeat',
      type: 'password',
      value: '',
      label: 'ChangePassword.password_repeat.label',
      placeholder: 'ChangePassword.password_repeat.label',
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

let ChangePasswordStore = Object.assign({}, EventEmitter.prototype, {
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
	      field.hint = 'ChangePassword.old_password.hints.0';
	    }
	    field.validationState = 'error';
	    break;

	  case 'password':
	    if (err.details[0].type === 'any.empty') {
	      field.hint = 'ChangePassword.password.hints.0';
	    }
	    if (err.details[0].type === 'string.min') {
	      field.hint = 'ChangePassword.password.hints.1';
	    }
	    field.validationState = 'error';
	    break;

	  case 'password_repeat':
	    if (err.details[0].type === 'any.empty') {
	      field.hint = 'ChangePassword.password_repeat.hints.0';
	    }
	    if (err.details[0].type === 'string.min') {
	      field.hint = 'ChangePassword.password_repeat.hints.1';
	    }
	    if (err.details[0].type === 'any.allowOnly') {
	      field.hint = 'ChangePassword.password_repeat.hints.2';
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

ChangePasswordStore.dispatchToken = AppDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.CHANGE_PASSWORD_FIELD_CHANGE:
      if (action.field === 'password') {
	newPassword = action.value;
      }
      _state.fields.forEach((item) => {
	if (item.name === action.field) {
	  item.value = action.value;
	  ChangePasswordStore.validate(item.name);
	}
      });
      _state.hasServerResponse = false;
      ChangePasswordStore.emitChange();
      break;
      
    case ActionTypes.CHANGE_PASSWORD_REQUEST_START:
      const authParam = Utils.getCookieItem(AUTHENTICATION_COOKIE_NAME);
      _state.loading = true;
      fetch(BASE_PRIVATE_URL + 'update-password', {
	method: 'PUT',
	headers: {
	  'Content-Type': 'application/json',
	  'Accept-Language': Utils.getBrowserLanguage(),
	  'Authorization': Utils.getAuthString(authParam)
	},
	body: JSON.stringify(action.data)
      }).then((response) => {
	return response.json();
      }).then((response) => {
	if (response.status === 200) {
	  ChangePasswordActionCreators.onChangePasswordSuccess();
	}
	if (response.status === 422) {
	  response.data.forEach((item) => {
	    let currentItem = _state.fields.find(field => field.name === item.field);
	    let data = {
	      field: currentItem.name,
	      hint: item.message,
	      validationState: 'error'
	    };
	    ChangePasswordActionCreators.onChangePasswordFail(data);
	  });
	}
      }).catch((error) => {
	console.error(error);
      });
      ChangePasswordStore.emitChange();
      break;

    case ActionTypes.CHANGE_PASSWORD_FAIL:
      _state.fields.forEach((item) => {
	if (item.name === action.data.field) {
	  item.validationState = action.data.validationState;
	  item.hint = action.data.hint;
	}
      });
      _state.loading = false;
      _state.hasServerResponse = true;
      ChangePasswordStore.emitChange();
      break;

    case ActionTypes.CHANGE_PASSWORD_SUCCESS:
      _state = _getInitialState();
      _state.alert.type = 'password-changed'
      _state.alert.isVisible = true;
      ChangePasswordStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default ChangePasswordStore;