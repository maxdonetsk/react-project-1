import {ActionTypes} from '../../common/constants/AppConstants';
import AppDispatcher from '../../common/dispatcher/AppDispatcher';

class UpdatePasswordActionCreators {

  changeField(field, value) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_PASSWORD_FIELD_CHANGE,
      field,
      value
    });
  }

  updatePassword(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_PASSWORD_REQUEST_START,
      data
    });
  }

  onUpdatePasswordSuccess() {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_PASSWORD_SUCCESS
    });
  }

  onUpdatePasswordFail(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_PASSWORD_FAIL,
      data
    });
  }
}

export default new UpdatePasswordActionCreators();
