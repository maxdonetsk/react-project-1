import AppDispatcher from '../../common/dispatcher/AppDispatcher';

//constants
import {ActionTypes,
	BASE_PRIVATE_URL,
	AUTHENTICATION_COOKIE_NAME} from '../../common/constants/AppConstants';

//actions
import BaseActionCreators from '../../common/actions/Base.actionCreators';

//utils
import Utils from '../../utils/Utils';

class ProfileActionCreators extends BaseActionCreators {

  getCurrentUserProfile(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_CURRENT_USER_PROFILE,
      data
    });
  }

  updateCurrentUserProfile(data, file) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_CURRENT_USER_PROFILE_REQUEST_START
    });
    
    const authParam = Utils.getCookieItem(AUTHENTICATION_COOKIE_NAME);
    let url = BASE_PRIVATE_URL + 'profile-image';

    let body = new FormData();
    body.append('profile_image', file);

    let options = {
      method: 'POST',
      headers: {
	'Accept-Language': Utils.getBrowserLanguage(),
	'Authorization': Utils.getAuthString(authParam)
      },
      body
    };

    if (!file) {
      url = BASE_PRIVATE_URL + 'profile';
      body = JSON.stringify(data);
      options = {
	method: 'PUT',
	headers: {
	  'Content-Type': 'application/json',
	  'Accept-Language': Utils.getBrowserLanguage(),
	  'Authorization': Utils.getAuthString(authParam)
	},
	body
      };
    }

    fetch(url, options)
    .then(this.parseJSON)
    .then((response) => {
      let data = response.data;
      if (response.status >= 200) {
	AppDispatcher.dispatch({
	  type: ActionTypes.UPDATE_CURRENT_USER_PROFILE_SUCCESS,
	  data
	});
      } else {
	AppDispatcher.dispatch({
	  type: ActionTypes.UPDATE_CURRENT_USER_PROFILE_FAIL,
	  data
	});
      }
    })
    .catch(this.handleError);
  }

  changeUserAvatarPreview(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_USER_AVATAR_PREVIEW,
      data
    });
  }

  onEditClick() {
    AppDispatcher.dispatch({
      type: ActionTypes.EDIT_PROFILE_BUTTON_CLICK
    });
  }

  onFieldChange(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.EDIT_PROFILE_FIELD_CHANGE,
      data
    });
  }
}

export default new ProfileActionCreators();
