import {EventEmitter} from 'events';
import AppDispatcher from '../../common/dispatcher/AppDispatcher';

//constants
import {ActionTypes,
	CHANGE_EVENT,
	BASE_PRIVATE_URL,
	AUTHENTICATION_COOKIE_NAME,
	USER_OBJECT_STORAGE_NAME,
	Routes} from '../../common/constants/AppConstants';
      
//actions
import ProfileActionCreators from './Profile.actionCreators';

//utils
import Utils from '../../utils/Utils';

function _getInitialState() {
  return {
    isLoggedIn: Utils.isLoggedIn(),
    user: JSON.parse(localStorage.getItem(USER_OBJECT_STORAGE_NAME)) || null,
    editProfileMode: false,
    loading: false,
    userAvatarPreview: null
  };
}

let _state = _getInitialState();

let UserStore = Object.assign({}, EventEmitter.prototype, {
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

  updateCurrentUser(authParam, data, file) {
    let url = BASE_PRIVATE_URL + 'profile-image';

    let body = new FormData();
    body.append('profile_image', file);

    let options = {
      method: 'POST',
      headers: {
	'Accept-Language': Utils.getBrowserLanguage(),
	'Authorization': Utils.getAuthString(authParam)
      },
      body
    };

    if (!file) {
      url = BASE_PRIVATE_URL + 'profile';
      body = JSON.stringify(data);
      options = {
	method: 'PUT',
	headers: {
	  'Content-Type': 'application/json',
	  'Accept-Language': Utils.getBrowserLanguage(),
	  'Authorization': Utils.getAuthString(authParam)
	},
	body
      };
    }
    
    fetch(url, options).then((response) => {
      return response.json();
    }).then((response) => {
      let data = response.data;
      if (response.status >= 200) {
	ProfileActionCreators.onUpdateCurrentUserProfileSuccess(data);
      } else {
	ProfileActionCreators.onUpdateCurrentUserProfileFail(data);
      }
    }).catch((error) => {
      console.error(error);
    });
  }
});

UserStore.dispatchToken = AppDispatcher.register(action => {
  switch (action.type) {

    case ActionTypes.SIGN_IN_SUCCESS:
      _state.isLoggedIn = Utils.isLoggedIn();
      UserStore.emitChange();
      break;

    case ActionTypes.LOGOUT:
      _state.isLoggedIn = Utils.isLoggedIn();
      localStorage.clear();
      UserStore.emitChange();
      location.replace(Routes.DEFAULT_ROUTE_FOR_GUEST);
      break;

    case ActionTypes.GET_CURRENT_USER_PROFILE:
      _state.user = action.data;
      localStorage.setItem(USER_OBJECT_STORAGE_NAME, JSON.stringify(action.data));
      UserStore.emitChange();
      break;

    case ActionTypes.UPDATE_CURRENT_USER_PROFILE_REQUEST_START:
      const authParam = Utils.getCookieItem(AUTHENTICATION_COOKIE_NAME);
      UserStore.updateCurrentUser(authParam, action.data, action.file);
      _state.loading = true;
      UserStore.emitChange();
      break;

    case ActionTypes.UPDATE_CURRENT_USER_PROFILE_SUCCESS:
      localStorage.setItem(USER_OBJECT_STORAGE_NAME, JSON.stringify(action.data));
      _state = _getInitialState();
      UserStore.emitChange();
      break;

    case ActionTypes.UPDATE_CURRENT_USER_PROFILE_FAIL:
      _state.loading = false;
      UserStore.emitChange();
      break;

    case ActionTypes.EDIT_PROFILE_BUTTON_CLICK:
      _state.editProfileMode = true;
      UserStore.emitChange();
      break;

    case ActionTypes.EDIT_PROFILE_FIELD_CHANGE:
      Object.keys(action.data).forEach((key) => {
	if (typeof(_state.user.profile[key]) === 'number') {
	  action.data[key] = Number(action.data[key]);
	}
	_state.user.profile[key] = action.data[key];
      });
      UserStore.emitChange();
      break;
      
    
    case ActionTypes.CHANGE_USER_AVATAR_PREVIEW:
      _state.userAvatarPreview = action.data;
      UserStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default UserStore;