import {ActionTypes} from '../../common/constants/AppConstants';
import AppDispatcher from '../../common/dispatcher/AppDispatcher';

class ChangePasswordActionCreators {

  changeField(field, value) {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_PASSWORD_FIELD_CHANGE,
      field,
      value
    });
  }

  changePassword(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_PASSWORD_REQUEST_START,
      data
    });
  }

  onChangePasswordSuccess() {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_PASSWORD_SUCCESS
    });
  }

  onChangePasswordFail(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_PASSWORD_FAIL,
      data
    });
  }
}

export default new ChangePasswordActionCreators();
