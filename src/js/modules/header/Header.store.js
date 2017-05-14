import {EventEmitter} from 'events';
import AppDispatcher from '../../common/dispatcher/AppDispatcher';

//constants
import {ActionTypes, CHANGE_EVENT} from '../../common/constants/AppConstants';
      
//actions
import HeaderActionCreators from './Header.actionCreators';

//utils
import Utils from '../../utils/Utils';

function _getInitialState() {
  return {
    isNavbarCollapsed: true
  };
}

let _state = _getInitialState();

let HeaderStore = Object.assign({}, EventEmitter.prototype, {
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

HeaderStore.dispatchToken = AppDispatcher.register(action => {
  switch (action.type) {

    case ActionTypes.CHANGE_NAVBAR_TOGGLE_ICON:
      _state.isNavbarCollapsed = !action.isNavbarCollapsed;
      HeaderStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default HeaderStore;