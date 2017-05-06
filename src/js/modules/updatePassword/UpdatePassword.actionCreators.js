import AppDispatcher from '../../common/dispatcher/AppDispatcher';

//constants
import {ActionTypes,
	BASE_PRIVATE_URL,
	AUTHENTICATION_COOKIE_NAME} from '../../common/constants/AppConstants';
      
//actions
import BaseActionCreators from '../../common/actions/Base.ActionCreators';
      
//utils
import Utils from '../../utils/Utils';
      
class UpdatePasswordActionCreators extends BaseActionCreators {

  changeField(field, value) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_PASSWORD_FIELD_CHANGE,
      field,
      value
    });
  }

  updatePassword(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_PASSWORD_REQUEST_START
    });

    const authParam = Utils.getCookieItem(AUTHENTICATION_COOKIE_NAME);
    const body = JSON.stringify(data);

    fetch(BASE_PRIVATE_URL + 'update-password', {
      method: 'PUT',
      headers: {
	'Content-Type': 'application/json',
	'Accept-Language': Utils.getBrowserLanguage(),
	'Authorization': Utils.getAuthString(authParam)
      },
      body
    })
    .then(this.parseJSON)
    .then(response => {
      if (response.status === 200) {
	AppDispatcher.dispatch({
	  type: ActionTypes.UPDATE_PASSWORD_SUCCESS
	});
      }
      if (response.status === 422) {
	AppDispatcher.dispatch({
	  type: ActionTypes.UPDATE_PASSWORD_FAIL,
	  data: response.data
	});
      }
    })
    .catch(this.handleError);
  }
}

export default new UpdatePasswordActionCreators();
