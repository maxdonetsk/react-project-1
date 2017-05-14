import AppDispatcher from '../../common/dispatcher/AppDispatcher';
import {EventEmitter} from 'events';

//constants
import {ActionTypes,
	CHANGE_EVENT,
	UserTypes} from '../../common/constants/AppConstants';
      
//actions
import FAQActionCreators from './FAQ.actionCreators';

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
  }
});

FAQStore.dispatchToken = AppDispatcher.register(action => {
  switch (action.type) {

    case ActionTypes.GET_USER_TYPES:
      _state.userTypes = action.data;
      FAQStore.emitChange();
      break;

    case ActionTypes.GET_FAQ:
      _state.loading = false;
      _state.FAQItems = action.data;
      _state.currentUserType = action.userType ? action.userType : _state.currentUserType;
      FAQStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default FAQStore;