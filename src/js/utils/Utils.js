//constants
import {DEFAULT_LANGUAGE,
	AVAILABLE_LANGUAGES,
	STORAGE_LANGUAGE_KEY,
	AUTHENTICATION_COOKIE_NAME,
	DOMAIN} from '../common/constants/AppConstants';

module.exports = {
  getBrowserLanguage() {
    let language = localStorage.getItem(STORAGE_LANGUAGE_KEY) || navigator.language || navigator.userLanguage;
    language = language.substring(0, 2).toLowerCase();
    return AVAILABLE_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
  },
  
  getAuthString(authParam) {
    return 'Basic ' + btoa(authParam + ':');
  },
  
  isLoggedIn() {
    return this.getCookieItem(AUTHENTICATION_COOKIE_NAME) ? true : false;
  },
  
  getCookieItem(sKey) {
    if (!sKey) {return null;}
    return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
  },
  
  setCookieItem(sKey, sValue, vExpires, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|domain|path|secure)$/i.test(sKey)) {return false;}
    if (vExpires) {
      switch (vExpires.constructor) {
	case Number:
	  vExpires = Number.isFinite(vExpires) ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
	  break;
	case String:
	  vExpires = '; expires=' + vExpires;
	  break;
	case Date:
	  vExpires = '; expires=' + vExpires.toUTCString();
	  break;
      }
    }
    const cookieStr = encodeURIComponent(sKey) + '=' +
		    encodeURIComponent(sValue) +
		    vExpires +
		    (sDomain ? '; domain=' + sDomain : '') +
		    (sPath ? '; path=' + sPath : '') +
		    (bSecure ? '; secure' : '');
    document.cookie = cookieStr;
    return cookieStr;
  },

  removeCookieItem(sKey, sPath, sDomain) {
    if (!this.hasCookieItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
    return true;
  },

  hasCookieItem(sKey) {
    if (!sKey) { return false; }
    return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
  },

  cookieKeys() {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  },

  removeAllCookieItems(sPath, sDomain) {
      var aKeys = this.cookieKeys();
      for (var i = 0; i < aKeys.length; i++) {
	this.removeCookieItem(aKeys[i], sPath, sDomain);
      }
  }
};
