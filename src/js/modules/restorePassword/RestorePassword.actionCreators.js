import {ActionTypes} from '../../common/constants/AppConstants';
import AppDispatcher from '../../common/dispatcher/AppDispatcher';

class RestorePasswordActionCreators {

  changeField(field, value) {
    AppDispatcher.dispatch({
      type: ActionTypes.RESTORE_PASSWORD_FIELD_CHANGE,
      field,
      value
    });
  }

  restorePassword(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RESTORE_PASSWORD_REQUEST_START,
      data
    });
  }

  onRestorePasswordSuccess(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RESTORE_PASSWORD_SUCCESS,
      data
    });
  }

  onRestorePasswordFail(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RESTORE_PASSWORD_FAIL,
      data
    });
  }
}

export default new RestorePasswordActionCreators();
