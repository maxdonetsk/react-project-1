import {ActionTypes} from '../../common/constants/AppConstants';
import AppDispatcher from '../../common/dispatcher/AppDispatcher';

class SignUpActionCreators {

  changeField(field, value) {
    AppDispatcher.dispatch({
      type: ActionTypes.SIGN_UP_FIELD_CHANGE,
      field,
      value
    });
  }

  signUp(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.SIGN_UP_REQUEST_START,
      data
    });
  }

  onSignUpSuccess(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.SIGN_UP_SUCCESS,
      data
    });
  }

  onSignUpFail(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.SIGN_UP_FAIL,
      data
    });
  }
}

export default new SignUpActionCreators();
