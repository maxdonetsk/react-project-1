import {EventEmitter} from 'events';
import AppDispatcher from '../../common/dispatcher/AppDispatcher';

//constants
import {ActionTypes,
	CHANGE_EVENT,
	BASE_PUBLIC_URL,
	UserTypes} from '../../common/constants/AppConstants';
      
//actions
import FAQActionCreators from './FAQ.actionCreators';

//utils
import Utils from '../../utils/Utils';
import orderBy from 'lodash/orderBy';

function _getInitialState() {
  return {
    loading: true,
    userTypes: null,
    currentUserType: UserTypes.DEFAULT,
    FAQItems: []
  };
}

let _state = _getInitialState();

let FAQStore = Object.assign({}, EventEmitter.prototype, {
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
  
  getUserTypes() {
    fetch(BASE_PUBLIC_URL + 'collection/user-types', {
      method: 'GET',
      headers: {
	'Accept-Language': Utils.getBrowserLanguage()
      }
    }).then((response) => {
      return response.json();
    }).then((response) => {
      let data = response.data;
      if (response.status === 200) {
	FAQActionCreators.onGetUserTypesSuccess(data.user_types);
      } else {
	FAQActionCreators.onGetUserTypesFail(data);
      }
    }).catch((error) => {
      console.error(error);
    });
  },

  getFAQ(userType) {
    userType = userType ? userType : UserTypes.DEFAULT;
    const url = (userType === UserTypes.GENERIC) ? BASE_PUBLIC_URL + 'questions' : BASE_PUBLIC_URL + 'questions?user_type=' + userType;

    fetch(url, {
      method: 'GET',
      headers: {
	'Accept-Language': Utils.getBrowserLanguage()
      }
    }).then((response) => {
      return response.json();
    }).then((response) => {
      let data = response.data;
      if (response.status === 200) {
	data.items = orderBy(data.items, ['id'], ['asc']);
	FAQActionCreators.onGetFAQSuccess(data.items, userType);
      } else {
	FAQActionCreators.onGetFAQFail(data);
      }
    }).catch((error) => {
      console.error(error);
    });
  }
});

FAQStore.dispatchToken = AppDispatcher.register(action => {
  switch (action.type) {

    case ActionTypes.GET_USER_TYPES_REQUEST_START:
      FAQStore.getUserTypes();
      break;

    case ActionTypes.GET_USER_TYPES_SUCCESS:
      _state.userTypes = action.data;
      FAQStore.emitChange();
      break;

    case ActionTypes.GET_USER_TYPES_FAIL:
      _state.userTypes = null;
      FAQStore.emitChange();
      break;

    case ActionTypes.GET_FAQ_REQUEST_START:
      FAQStore.getFAQ(action.userType);
      break;

    case ActionTypes.GET_FAQ_SUCCESS:
      _state.loading = false;
      _state.FAQItems = action.data;
      _state.currentUserType = action.userType;
      FAQStore.emitChange();
      break;

    case ActionTypes.GET_FAQ_FAIL:
      _state.loading = false;
      FAQStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default FAQStore;