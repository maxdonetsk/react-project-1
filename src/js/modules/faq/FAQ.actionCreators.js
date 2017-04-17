import {ActionTypes} from '../../common/constants/AppConstants';
import AppDispatcher from '../../common/dispatcher/AppDispatcher';

class FAQActionCreators {

  getUserTypes() {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_USER_TYPES_REQUEST_START
    });
  }

  onGetUserTypesSuccess(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_USER_TYPES_SUCCESS,
      data
    });
  }

  onGetUserTypesFail(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_USER_TYPES_FAIL,
      data
    });
  }

  getFAQ(userType) {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_FAQ_REQUEST_START,
      userType
    });
  }
  
  onGetFAQSuccess(data, userType) {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_FAQ_SUCCESS,
      data,
      userType
    });
  }

  onGetFAQFail(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_FAQ_FAIL,
      data
    });
  }
}

export default new FAQActionCreators();
