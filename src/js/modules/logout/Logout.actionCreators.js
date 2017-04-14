import {ActionTypes} from '../../common/constants/AppConstants';
import AppDispatcher from '../../common/dispatcher/AppDispatcher';

//constants
import {PATH, DOMAIN} from '../../common/constants/AppConstants';

//utils
import History from '../../utils/History';
import Utils from '../../utils/Utils';

class LogoutActionCreators {

  logout() {
    Utils.removeAllCookieItems(PATH, DOMAIN);
    AppDispatcher.dispatch({
      type: ActionTypes.LOGOUT
    });
  }

}

export default new LogoutActionCreators();
