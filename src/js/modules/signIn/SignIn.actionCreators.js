import AppDispatcher from '../../common/dispatcher/AppDispatcher';

//constants
import {ActionTypes} from '../../common/constants/AppConstants';


class SignInActionCreators {

  changeField(field, value) {
    AppDispatcher.dispatch({
      type: ActionTypes.SIGN_IN_FIELD_CHANGE,
      field,
      value
    });
  }

  signIn(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.SIGN_IN_REQUEST_START,
      data
    });
  }

  onSignInSuccess() {
    AppDispatcher.dispatch({
      type: ActionTypes.SIGN_IN_SUCCESS
    });
  }
  
  onSignInFail(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.SIGN_IN_FAIL,
      data
    });
  }
}

export default new SignInActionCreators();
