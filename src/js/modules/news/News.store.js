import AppDispatcher from '../../common/dispatcher/AppDispatcher';
import {EventEmitter} from 'events';

//constants
import {ActionTypes, CHANGE_EVENT} from '../../common/constants/AppConstants';
      
//actions
import NewsActionCreators from './News.actionCreators';

function _getInitialState() {
  return {
    loading: true,
    NewsItems: [],
    currentItem: {
      loading: true
    }
  };
}

let _state = _getInitialState();

let NewsStore = Object.assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getCurrentItem() {
    return _state.currentItem;
  },

  getState() {
    return _state;
  }
});

NewsStore.dispatchToken = AppDispatcher.register(action => {
  switch (action.type) {

    case ActionTypes.GET_NEWS_REQUEST_START:
      _state.loading = true;
      NewsStore.emitChange();
      break;

    case ActionTypes.GET_NEWS_REQUEST_END:
      _state.loading = false;
      _state.NewsItems = action.data;
      NewsStore.emitChange();
      break;

    case ActionTypes.GET_NEW_REQUEST_START:
      _state.currentItem.loading = true;
      NewsStore.emitChange();
      break;

    case ActionTypes.GET_NEW_REQUEST_END:
      _state.currentItem.loading = false;
      Object.assign(_state.currentItem, action.data);
      NewsStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default NewsStore;