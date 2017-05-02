import {ActionTypes} from '../../common/constants/AppConstants';
import AppDispatcher from '../../common/dispatcher/AppDispatcher';

class LocationsOfLoadingActionCreators {

  getLocationsOfLoadingTypes() {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_LOCATIONS_OF_LOADING_TYPES_REQUEST_START
    });
  }

  onGetLocationsOfLoadingTypesSuccess(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_LOCATIONS_OF_LOADING_TYPES_SUCCESS,
      data
    });
  }

  onGetLocationsOfLoadingTypesFail(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_LOCATIONS_OF_LOADING_TYPES_FAIL,
      data
    });
  }

  getLocationsOfLoading() {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_LOCATIONS_OF_LOADING_REQUEST_START
    });
  }

  onGetLocationsOfLoadingSuccess(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_LOCATIONS_OF_LOADING_SUCCESS,
      data
    });
  }

  onGetLocationsOfLoadingFail(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_LOCATIONS_OF_LOADING_FAIL,
      data
    });
  }

  getLocationOfLoading(id) {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_LOCATION_OF_LOADING_REQUEST_START,
      id
    });
  }

  onGetLocationOfLoadingSuccess(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_LOCATION_OF_LOADING_SUCCESS,
      data
    });
  }

  onGetLocationOfLoadingFail(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.GET_LOCATION_OF_LOADING_FAIL,
      data
    });
  }

  updateLocationOfLoading(data, id) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_LOCATION_OF_LOADING_REQUEST_START,
      data,
      id
    });
  }

  onUpdateLocationOfLoadingSuccess(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_LOCATION_OF_LOADING_SUCCESS,
      data
    });
  }

  onUpdateLocationOfLoadingFail(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_LOCATION_OF_LOADING_FAIL,
      data
    });
  }

  deleteLocationOfLoading(id) {
    AppDispatcher.dispatch({
      type: ActionTypes.DELETE_LOCATION_OF_LOADING_REQUEST_START,
      id
    });
  }

  onDeleteLocationOfLoadingSuccess() {
    AppDispatcher.dispatch({
      type: ActionTypes.DELETE_LOCATION_OF_LOADING_SUCCESS
    });
  }

  onDeleteLocationOfLoadingFail() {
    AppDispatcher.dispatch({
      type: ActionTypes.DELETE_LOCATION_OF_LOADING_FAIL
    });
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
      type: ActionTypes.ADD_LOCATION_OF_LOADING_REQUEST_START,
      data
    });
  }

  onAddLocationOfLoadingSuccess(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.ADD_LOCATION_OF_LOADING_SUCCESS,
      data
    });
  }

  onAddLocationOfLoadingFail(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.ADD_LOCATION_OF_LOADING_FAIL,
      data
    });
  }
  
  resetFlashMessage() {
    AppDispatcher.dispatch({
      type: ActionTypes.RESET_FLASH_MESSAGE
    });
  }
}

export default new LocationsOfLoadingActionCreators();
