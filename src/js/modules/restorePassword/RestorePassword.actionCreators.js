import AppDispatcher from '../../common/dispatcher/AppDispatcher';

//constants
import {ActionTypes,
	BASE_PRIVATE_URL,
	Routes} from '../../common/constants/AppConstants';

//actions
import BaseActionCreators from '../../common/actions/Base.actionCreators';

//utils
import Utils from '../../utils/Utils';
import History from '../../utils/History';

class RestorePasswordActionCreators extends BaseActionCreators {

  changeField(field, value) {
    AppDispatcher.dispatch({
      type: ActionTypes.RESTORE_PASSWORD_FIELD_CHANGE,
      field,
      value
    });
  }

  restorePassword(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RESTORE_PASSWORD_REQUEST_START
    });

    const body = JSON.stringify(data);

    fetch(BASE_PRIVATE_URL + 'restore-password', {
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
	let data = [
	  {
	    field: 'phone',
	    registered: response.data.registered,
	    value: response.data.phone,
	    hint: null,
	    validationState: null
	  },
	  {
	    field: 'password',
	    value: '',
	    hint: null,
	    validationState: null
	  }
	];
	AppDispatcher.dispatch({
	  type: ActionTypes.RESTORE_PASSWORD_SUCCESS,
	  data
	});
	History.push(Routes.SIGNIN);
      }
      if (response.status === 422) {
	response.data.forEach((item) => {
	  if (item.field === 'phone') {
	    item.hint = item.message;
	  }
	  let data = {
	    field: item.field,
	    hint: item.hint,
	    validationState: 'error'
	  };
	  AppDispatcher.dispatch({
	    type: ActionTypes.RESTORE_PASSWORD_FAIL,
	    data
	  });
	});
      }
    })
    .catch(this.handleError);
  }
}

export default new RestorePasswordActionCreators();
