//constants
import {ActionTypes,
	BASE_PRIVATE_URL,
	BASE_PUBLIC_URL} from '../../common/constants/AppConstants';

//utils
import bindAll from 'lodash/bindAll';
import Utils from '../../utils/Utils';

class BaseActionCreators {

  constructor() {
    bindAll(this, 'checkStatus', 'parseJSON', 'handleError',
	    'getCurrentUser', 'getUserTypes', 'getLocationsOfLoadingTypes');
  }

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }

  parseJSON(response) {
    return response.json();
  }

  returnResponse(response) {
    return response;
  }

  handleError(error) {
    console.error(error);
  }

  getCurrentUser(authParam) {
    return fetch(BASE_PRIVATE_URL + 'profile', {
      method: 'GET',
      headers: {
	'Accept-Language': Utils.getBrowserLanguage(),
	'Authorization': Utils.getAuthString(authParam)
      }
    })
    .then(this.parseJSON)
  }

  getUserTypes() {
    return fetch(BASE_PUBLIC_URL + 'collection/user-types', {
      method: 'GET',
      headers: {
	'Accept-Language': Utils.getBrowserLanguage()
      }
    })
    .then(this.parseJSON)
  }

  getLocationsOfLoadingTypes(authParam) {
    return fetch(BASE_PRIVATE_URL + 'collection/shipment-types', {
      method: 'GET',
      headers: {
	'Accept-Language': Utils.getBrowserLanguage(),
	'Authorization': Utils.getAuthString(authParam)
      }
    })
    .then(this.parseJSON)
  }

}

export default BaseActionCreators;
