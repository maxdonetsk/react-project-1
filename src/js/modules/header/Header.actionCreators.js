import {ActionTypes} from '../../common/constants/AppConstants';
import AppDispatcher from '../../common/dispatcher/AppDispatcher';

class HeaderActionCreators {

  changeLanguage(language) {
    AppDispatcher.dispatch({
      type: ActionTypes.APP_LANGUAGE_CHANGED,
      path
    });
  }
}

export default new HeaderActionCreators();
