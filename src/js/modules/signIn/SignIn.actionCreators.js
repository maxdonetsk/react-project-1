import AppDispatcher from '../../common/dispatcher/AppDispatcher';

//constants
import {ActionTypes,
	BASE_PRIVATE_URL,
	AUTHENTICATION_COOKIE_NAME,
	USER_ID_COOKIE_NAME,
	USER_OBJECT_STORAGE_NAME,
	PATH,
	DOMAIN,
	SECURE} from '../../common/constants/AppConstants';

//actions
import BaseActionCreators from '../../common/actions/Base.ActionCreators';

//utils
import Utils from '../../utils/Utils';

class SignInActionCreators extends BaseActionCreators {

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

    const body = JSON.stringify(data);

    fetch(BASE_PRIVATE_URL + 'login', {
      method: 'POST',
      headers: {
	'Content-Type': 'application/json',
	'Accept-Language': Utils.getBrowserLanguage()
      },
      body
    })
    .then(this.parseJSON)
    .then(response => {
      if (response.status === 201) {
	const data = response.data;
	Utils.setCookieItem(AUTHENTICATION_COOKIE_NAME, data[AUTHENTICATION_COOKIE_NAME], Infinity, PATH, DOMAIN, SECURE);
	Utils.setCookieItem(USER_ID_COOKIE_NAME, data[USER_ID_COOKIE_NAME], Infinity, PATH, DOMAIN, SECURE);
	this.getCurrentUser(data[AUTHENTICATION_COOKIE_NAME])
	.then(response => {
	  const data = response.data;
	  localStorage.setItem(USER_OBJECT_STORAGE_NAME, JSON.stringify(data));
	  AppDispatcher.dispatch({
	    type: ActionTypes.GET_CURRENT_USER_PROFILE,
	    data
	  });
	  AppDispatcher.dispatch({
	    type: ActionTypes.SIGN_IN_SUCCESS
	  });
	});
      }
      if (response.status === 422) {
	response.data.forEach((item) => {
	  const data = {
	    field: item.field,
	    hint: item.message,
	    validationState: 'error'
	  };
	  AppDispatcher.dispatch({
	    type: ActionTypes.SIGN_IN_FAIL,
	    data
	  });
	});
      }
    })
    .catch(this.handleError);
  }
}

export default new SignInActionCreators();
