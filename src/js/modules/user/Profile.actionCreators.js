import {ActionTypes} from '../../common/constants/AppConstants';
import AppDispatcher from '../../common/dispatcher/AppDispatcher';

class ProfileActionCreators {
  
  getCurrentUserProfile(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_CURRENT_USER_PROFILE,
      data
    });
  }

  updateCurrentUserProfile(data, file) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_CURRENT_USER_PROFILE_REQUEST_START,
      data,
      file
    });
  }
  
  changeUserAvatarPreview(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_USER_AVATAR_PREVIEW,
      data
    });
  }

  onUpdateCurrentUserProfileSuccess(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_CURRENT_USER_PROFILE_SUCCESS,
      data
    });
  }

  onUpdateCurrentUserProfileFail(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_CURRENT_USER_PROFILE_FAIL,
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
