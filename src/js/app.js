import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router-dom'; 

//components
import App from './common/components/App.component';
import Footer from './modules/footer/Footer.component';

//utils
import History from './utils/History';

//styles
require ('./../styles/main.scss');

ReactDOM.render(
  <Router history={History}>
    <App />
  </Router>,
  document.getElementById('app'));
  
ReactDOM.render(<Footer />, document.getElementById('footer'));