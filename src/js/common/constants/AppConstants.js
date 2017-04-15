import keyMirror from 'keymirror';

module.exports = {
  ActionTypes: keyMirror({

    /**
     * Common
     */
    COOKIE_ITEM_SET: null,

    /**
     * Sign up
     */
    SIGN_UP_FIELD_CHANGE: null,
    SIGN_UP_REQUEST_START: null,
    SIGN_UP_FAIL: null,
    SIGN_UP_SUCCESS: null,

    /**
     * Sign in
     */
    SIGN_IN_FIELD_CHANGE: null,
    SIGN_IN_REQUEST_START: null,
    SIGN_IN_FAIL: null,
    SIGN_IN_SUCCESS: null,

    /**
     * Logout
     */
    LOGOUT: null,
    
    /**
     * User
     */
    GET_CURRENT_USER_PROFILE: null,
    UPDATE_CURRENT_USER_PROFILE_REQUEST_START: null,
    UPDATE_CURRENT_USER_PROFILE_SUCCESS: null,
    UPDATE_CURRENT_USER_PROFILE_FAIL: null,
    EDIT_PROFILE_BUTTON_CLICK: null,
    EDIT_PROFILE_FIELD_CHANGE: null,
    CHANGE_USER_AVATAR_PREVIEW: null
    
  }),
  
  Routes: {
    SIGNIN: '/sign-in',
    SIGNUP: '/sign-up',
    PROFILE: '/profile',
    CHANGE_PASSWORD: '/change-password'
  },

  PROJECT_NAME: 'GrainBroker',
  BASE_URL: 'https://api.veles.trade/v1/producer/',
  DEFAULT_LANGUAGE: 'en',
  AVAILABLE_LANGUAGES: ['en', 'ru', 'uk'],
  CHANGE_EVENT: 'change',

  /*
   * Session data
  */
  STORAGE_LANGUAGE_KEY: 'i18nextLng',
  AUTHENTICATION_COOKIE_NAME: 'token',
  USER_ID_COOKIE_NAME: 'uuid',
  USER_OBJECT_STORAGE_NAME: 'user',
  DOMAIN: __DEV__ ? 'localhost' : 'https://producer.veles.trade',
  PATH: '/',
  SECURE: false
};
