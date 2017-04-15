import {EventEmitter} from 'events';
import AppDispatcher from '../../common/dispatcher/AppDispatcher';

//constants
import {ActionTypes,
	CHANGE_EVENT,
	BASE_URL,
	AUTHENTICATION_COOKIE_NAME,
	USER_ID_COOKIE_NAME,
	PATH,
	DOMAIN,
	SECURE,
	Routes} from '../../common/constants/AppConstants';
      
//actions
import SignInActionCreators from './SignIn.actionCreators';
import ProfileActionCreators from '../user/Profile.actionCreators';

//utils
import Joi from 'joi';
import Utils from '../../utils/Utils';
import History from '../../utils/History';

const _schema = {
  phone: Joi.string().regex(/^\d+$/).min(10).max(15).required(),
  password: Joi.string().required()
};

function _getInitialState() {
  return {
    fields: [{
      name: 'phone',
      type: 'tel',
      value: '',
      label: 'SignIn.phone.label',
      placeholder: 'SignIn.phone.label',
      isValid: false,
      validationState: null,
      hint: ''
    },
    {
      name: 'password',
      type: 'password',
      value: '',
      label: 'SignIn.password.label',
      placeholder: 'SignIn.password.label',
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

let SignInStore = Object.assign({}, EventEmitter.prototype, {
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
    let value = Object.create(null);
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
		field.hint = 'SignIn.phone.hints.0';
	    } else {
	      field.hint = 'SignIn.phone.hints.1';
	    }
	    field.validationState = 'error';
	    break;

	  case 'password':
	      if (err.details[0].type === 'any.empty') {
		  field.hint = 'SignIn.password.hints.0';
	      }
	      field.validationState = 'error';
	      break;

	  default:
	    break;
	}
      }

      return !!err;
    });
   },

   getCurrentUser(authParam) {
    fetch(BASE_URL + 'profile', {
      method: 'GET',
      headers: {
	'Accept-Language': Utils.getBrowserLanguage(),
	'Authorization': Utils.getAuthString(authParam)
      }
    }).then((response) => {
      return response.json();
    }).then((response) => {
      let data = response.data;
      if (response.status === 200) {
	ProfileActionCreators.getCurrentUserProfile(data);
	SignInActionCreators.onSignInSuccess();
	History.replace(Routes.PROFILE);
      }
    }).catch((error) => {
      console.error(error);
    });
  }
});

SignInStore.dispatchToken = AppDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.SIGN_IN_FIELD_CHANGE:
      _state.fields.forEach((item) => {
	if (item.name === action.field) {
	  item.value = action.value;
	  SignInStore.validate(item.name);
	}
      });
      _state.hasServerResponse = false;
      SignInStore.emitChange();
      break;
      
    case ActionTypes.SIGN_IN_REQUEST_START:
      fetch(BASE_URL + 'login', {
	method: 'POST',
	headers: {
	  'Content-Type': 'application/json',
	  'Accept-Language': Utils.getBrowserLanguage()
	},
	body: JSON.stringify(action.data)
      }).then((response) => {
	return response.json();
      }).then((response) => {
	if (response.status === 201) {
	  let data = response.data;
	  data.isLoggedIn = true;
	  Utils.setCookieItem(AUTHENTICATION_COOKIE_NAME, data[AUTHENTICATION_COOKIE_NAME], Infinity, PATH, DOMAIN, SECURE);
	  Utils.setCookieItem(USER_ID_COOKIE_NAME, data[USER_ID_COOKIE_NAME], Infinity, PATH, DOMAIN, SECURE);
	  SignInStore.getCurrentUser(data[AUTHENTICATION_COOKIE_NAME]);
	}
	if (response.status === 422) {
	  response.data.forEach((item) => {
	    let data = {
	      field: item.field,
	      hint: item.message,
	      validationState: 'error'
	    };
	    SignInActionCreators.onSignInFail(data);
	  });
	}
      }).catch((error) => {
	console.error(error);
      });
      _state.loading = true;
      SignInStore.emitChange();
      break;

    case ActionTypes.SIGN_IN_FAIL:
      _state.fields.forEach((item) => {
	if (item.name === action.data.field) {
	  item.validationState = action.data.validationState;
	  item.hint = action.data.hint;
	}
      });
      _state.loading = false;
      _state.hasServerResponse = true;
      SignInStore.emitChange();
      break;

    case ActionTypes.SIGN_IN_SUCCESS:
      _state.loading = false;
      SignInStore.emitChange();
      break;

    case ActionTypes.SIGN_UP_SUCCESS:
      _state.fields.forEach((item) => {
	const inner = action.data.find((obj) => item.name === obj.field);
	if (item.name === inner.field) {
	  item.value = inner.value;
	  item.hint = inner.hint;
	  item.validationState = inner.validationState;
	}
	if (item.name === 'phone') {
	  SignInStore.validate(item.name);
	}
      });
      _state.alert.type = 'sign-up-success'
      _state.alert.isVisible = true;
      SignInStore.emitChange();
      break;
      
    case ActionTypes.LOGOUT:
      _state = _getInitialState();
      SignInStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default SignInStore;