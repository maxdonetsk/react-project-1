import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router-dom'; 

//components
import App from './common/components/App.component';

//utils
import History from './utils/History';

//styles
require ('./../styles/main.scss');

ReactDOM.render(
  <Router history={History}>
    <App />
  </Router>,
  document.getElementById('app'));