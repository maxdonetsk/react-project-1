import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Cache from 'i18next-localstorage-cache';

//constants
import {DEFAULT_LANGUAGE, AVAILABLE_LANGUAGES} from '../common/constants/AppConstants';

//utils
import Utils from './Utils';

let i18next = null;
class I18n {
  constructor() {
    if (i18next) {
      return i18next;
    } else {
      i18next = i18n
	.use(LanguageDetector)
	.init({
	  lng: Utils.getBrowserLanguage(),
	  lngs: AVAILABLE_LANGUAGES,
	  fallbackLng: DEFAULT_LANGUAGE,
	  resources: {
	      en: require('../../locales/en/translation.json'),
	      ru: require('../../locales/ru/translation.json'),
	      uk: require('../../locales/uk/translation.json'),
	  },
	  cache: {
	    enabled: true
	  }
	});
      return i18next;
    }
  }
}

export default new I18n();
