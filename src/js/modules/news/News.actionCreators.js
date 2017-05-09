import AppDispatcher from '../../common/dispatcher/AppDispatcher';

//constants
import {ActionTypes, BASE_PUBLIC_URL, UserTypes} from '../../common/constants/AppConstants';

//actions
import BaseActionCreators from '../../common/actions/Base.actionCreators';

//utils
import Utils from '../../utils/Utils';

class NewsActionCreators extends BaseActionCreators {

  getNews(userType) {
    this.getUserTypes()
      .then(response => {
	let data = response.data;
	if (response.status === 200) {

	  userType = userType ? userType : UserTypes.DEFAULT;
	  const url = (userType === UserTypes.GENERIC) ? BASE_PUBLIC_URL + 'news' : BASE_PUBLIC_URL + 'news?user_type=' + userType;

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
	      AppDispatcher.dispatch({
		type: ActionTypes.GET_NEWS,
		data: data.items
	      });
	    } else {
	      AppDispatcher.dispatch({
		type: ActionTypes.GET_NEWS,
		data: []
	      });
	    }
	  })
	  .catch(this.handleError);
	}
      })
      .catch(this.handleError);
  }
  
  getNew(id) {
    fetch(BASE_PUBLIC_URL + 'news/' + id, {
      method: 'GET',
      headers: {
	'Accept-Language': Utils.getBrowserLanguage()
      }
    })
    .then(this.parseJSON)
    .then(response => {
      let data = response.data;
      if (response.status === 200) {
	AppDispatcher.dispatch({
	  type: ActionTypes.GET_NEW,
	  data
	});
      } else {
	AppDispatcher.dispatch({
	  type: ActionTypes.GET_NEW,
	  data: []
	});
      }
    })
    .catch(this.handleError);
  }
}

export default new NewsActionCreators();
