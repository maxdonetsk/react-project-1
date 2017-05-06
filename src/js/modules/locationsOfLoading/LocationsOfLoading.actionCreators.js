import AppDispatcher from '../../common/dispatcher/AppDispatcher';

//constants
import {ActionTypes,
	BASE_PRIVATE_URL,
	AUTHENTICATION_COOKIE_NAME} from '../../common/constants/AppConstants';

//actions
import BaseActionCreators from '../../common/actions/Base.ActionCreators';

//utils
import History from '../../utils/History';
import Utils from '../../utils/Utils';
import bindAll from 'lodash/bindAll';
import orderBy from 'lodash/orderBy';

class LocationsOfLoadingActionCreators extends BaseActionCreators {
  constructor() {
    super();
    bindAll(this, 'getLocationsOfLoading');
  }

  getLocationsOfLoading() {
//    AppDispatcher.dispatch({
//      type: ActionTypes.GET_LOCATIONS_OF_LOADING_TYPES_REQUEST_START
//    });

    const authParam = Utils.getCookieItem(AUTHENTICATION_COOKIE_NAME);

    this.getLocationsOfLoadingTypes(authParam)
    .then(response => {
      let data = response.data;
      if (response.status === 200) {
	AppDispatcher.dispatch({
	  type: ActionTypes.GET_LOCATIONS_OF_LOADING_TYPES_REQUEST_END,
	  data: data.shipment_types
	});
      } else {
	AppDispatcher.dispatch({
	  type: ActionTypes.GET_LOCATIONS_OF_LOADING_TYPES_REQUEST_END,
	  data: null
	});
      }
    })
    .then(() => {
      AppDispatcher.dispatch({
	type: ActionTypes.GET_LOCATIONS_OF_LOADING_REQUEST_START
      });
      fetch(BASE_PRIVATE_URL + 'grain-shipment-places', {
	method: 'GET',
	headers: {
	  'Accept-Language': Utils.getBrowserLanguage(),
	  'Authorization': Utils.getAuthString(authParam)
	}
      })
      .then(this.parseJSON)
      .then(response => {
	let data = response.data;
	if (response.status === 200) {
	  data.items = orderBy(data.items, ['id'], ['asc']);
	  AppDispatcher.dispatch({
	    type: ActionTypes.GET_LOCATIONS_OF_LOADING_REQUEST_END,
	    data: data.items
	  });
	} else {
	  AppDispatcher.dispatch({
	    type: ActionTypes.GET_LOCATIONS_OF_LOADING_REQUEST_END,
	    data: []
	  });
	}
      })
      .catch(this.handleError);
    })
    .catch(this.handleError);
  }

  getLocationOfLoading(id) {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_LOCATION_OF_LOADING_REQUEST_START
    });

    const authParam = Utils.getCookieItem(AUTHENTICATION_COOKIE_NAME);

    fetch(BASE_PRIVATE_URL + 'grain-shipment-places/' + id, {
      method: 'GET',
      headers: {
	'Accept-Language': Utils.getBrowserLanguage(),
	'Authorization': Utils.getAuthString(authParam)
      }
    })
    .then(this.parseJSON)
    .then(response => {
      if (response.status === 200) {
	AppDispatcher.dispatch({
	  type: ActionTypes.GET_LOCATION_OF_LOADING_REQUEST_END,
	  data: response.data
	});
      } else {
	AppDispatcher.dispatch({
	  type: ActionTypes.GET_LOCATION_OF_LOADING_REQUEST_END,
	  data: null
	});
      }
    })
    .catch(this.handleError);
  }

  updateLocationOfLoading(data, id) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_LOCATION_OF_LOADING_REQUEST_START
    });

    const body = JSON.stringify(data);
    const authParam = Utils.getCookieItem(AUTHENTICATION_COOKIE_NAME);

    fetch(BASE_PRIVATE_URL + 'grain-shipment-places/' + id, {
      method: 'PUT',
      headers: {
	'Content-Type': 'application/json',
	'Accept-Language': Utils.getBrowserLanguage(),
	'Authorization': Utils.getAuthString(authParam)
      },
      body
    })
    .then(this.parseJSON)
    .then(response => {
      if (response.status === 200) {
	AppDispatcher.dispatch({
	  type: ActionTypes.UPDATE_LOCATION_OF_LOADING_REQUEST_END,
	  data: response.data
	});
      } else {
	AppDispatcher.dispatch({
	  type: ActionTypes.UPDATE_LOCATION_OF_LOADING_REQUEST_END,
	  data: null
	});
      }
    })
    .catch(this.handleError);
  }

  deleteLocationOfLoading(id) {
    AppDispatcher.dispatch({
      type: ActionTypes.DELETE_LOCATION_OF_LOADING_REQUEST_START,
      id
    });

    const authParam = Utils.getCookieItem(AUTHENTICATION_COOKIE_NAME);

    fetch(BASE_PRIVATE_URL + 'grain-shipment-places/' + id, {
      method: 'DELETE',
      headers: {
	'Accept-Language': Utils.getBrowserLanguage(),
	'Authorization': Utils.getAuthString(authParam)
      }
    })
    .then(this.checkStatus)
    .then(response => {
      if (response.status === 204) {
	AppDispatcher.dispatch({
	  type: ActionTypes.DELETE_LOCATION_OF_LOADING_REQUEST_END,
	  data: true
	});
      } else {
	AppDispatcher.dispatch({
	  type: ActionTypes.DELETE_LOCATION_OF_LOADING_REQUEST_END,
	  data: false
	});
      }
    })
    .then(() => {
      this.getLocationsOfLoading();
      setTimeout(() => {
	History.replace(Routes.LOCATIONS_OF_LOADING);
      }, 1000);
    })
    .catch(this.handleError);
  }

  changeField(type, field, value, isCurrent) {
    AppDispatcher.dispatch({
      type: ActionTypes.LOCATIONS_OF_LOADING_FIELD_CHANGE,
      data: {
	type,
	field,
	value,
	isCurrent
      }
    });
  }

  onAddClick() {
    AppDispatcher.dispatch({
      type: ActionTypes.ADD_LOCATION_OF_LOADING_BUTTON_CLICK
    });
  }

  addLocationOfLoadingReset() {
    AppDispatcher.dispatch({
      type: ActionTypes.ADD_LOCATION_OF_LOADING_RESET
    });
  }

  addLocationOfLoadingSubmit(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.ADD_LOCATION_OF_LOADING_REQUEST_START
    });

    const body = JSON.stringify(data);
    const authParam = Utils.getCookieItem(AUTHENTICATION_COOKIE_NAME);

    fetch(BASE_PRIVATE_URL + 'grain-shipment-places', {
      method: 'POST',
      headers: {
	'Content-Type': 'application/json',
	'Accept-Language': Utils.getBrowserLanguage(),
	'Authorization': Utils.getAuthString(authParam)
      },
      body
    })
    .then(this.parseJSON)
    .then((response) => {
      let data = response.data;
      if (response.status === 201) {
	AppDispatcher.dispatch({
	  type: ActionTypes.ADD_LOCATION_OF_LOADING_SUCCESS,
	  data
	});
	this.getLocationsOfLoading();
      } else if (response.status === 422) {
	data.forEach((item) => {
	  let data = {
	    field: item.field,
	    hint: item.message,
	    validationState: 'error'
	  };
	  AppDispatcher.dispatch({
	    type: ActionTypes.ADD_LOCATION_OF_LOADING_FAIL,
	    data
	  });
	});
      } else {
	AppDispatcher.dispatch({
	  type: ActionTypes.ADD_LOCATION_OF_LOADING_FAIL,
	  data
	});
      }
    })
    .catch(this.handleError);
  }

  resetFlashMessage() {
    AppDispatcher.dispatch({
      type: ActionTypes.RESET_FLASH_MESSAGE
    });
  }
}

export default new LocationsOfLoadingActionCreators();
