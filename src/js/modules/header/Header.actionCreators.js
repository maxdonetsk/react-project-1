import AppDispatcher from '../../common/dispatcher/AppDispatcher';
import {ActionTypes} from '../../common/constants/AppConstants';

class HeaderActionCreators {

  changeNavbarToogleIcon(isNavbarCollapsed) {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_NAVBAR_TOGGLE_ICON,
      isNavbarCollapsed
    });
  }
}

export default new HeaderActionCreators();
