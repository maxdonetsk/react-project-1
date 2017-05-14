import AppDispatcher from '../../common/dispatcher/AppDispatcher';
import {EventEmitter} from 'events';

//constants
import {ActionTypes,
	CHANGE_EVENT,
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

  getUserInfo() {
    return _state.user;
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
      _state.editProfileMode = false;
      localStorage.setItem(USER_OBJECT_STORAGE_NAME, JSON.stringify(action.data));
      UserStore.emitChange();
      break;

    case ActionTypes.UPDATE_CURRENT_USER_PROFILE_REQUEST_START:
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