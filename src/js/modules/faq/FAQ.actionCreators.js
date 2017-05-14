import AppDispatcher from '../../common/dispatcher/AppDispatcher';

//constants
import {ActionTypes, BASE_PUBLIC_URL, UserTypes} from '../../common/constants/AppConstants';

//actions
import BaseActionCreators from '../../common/actions/Base.actionCreators';

//utils
import Utils from '../../utils/Utils';
import orderBy from 'lodash/orderBy';

class FAQActionCreators extends BaseActionCreators {

  getFAQ(userType) {
    this.getUserTypes()
      .then(response => {
	let data = response.data;
	if (response.status === 200) {
	  AppDispatcher.dispatch({
	    type: ActionTypes.GET_USER_TYPES,
	    data: data.user_types
	  });

	  userType = userType ? userType : UserTypes.DEFAULT;
	  const url = (userType === UserTypes.GENERIC) ? BASE_PUBLIC_URL + 'questions' : BASE_PUBLIC_URL + 'questions?user_type=' + userType;

	  fetch(url, {
	    method: 'GET',
	    headers: {
	      'Accept-Language': Utils.getBrowserLanguage()
	    }
	  })
	  .then(this.parseJSON)
	  .then(response => {
	    let data = response.data;
	    if (response.status === 200) {
	      data.items = orderBy(data.items, ['id'], ['asc']);
	      AppDispatcher.dispatch({
		type: ActionTypes.GET_FAQ,
		data: data.items,
		userType
	      });
	    } else {
	      AppDispatcher.dispatch({
		type: ActionTypes.GET_FAQ,
		data: []
	      });
	    }
	  })
	  .catch(this.handleError);
	} else {
	  AppDispatcher.dispatch({
	    type: ActionTypes.GET_USER_TYPES,
	    data: null
	  });
	}
      })
      .catch(this.handleError);
  }
}

export default new FAQActionCreators();
