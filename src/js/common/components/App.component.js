import React from 'react';
import {Route, Redirect} from 'react-router';

//constants
import {Routes} from '../../common/constants/AppConstants';

//components
import Header from '../../modules/header/Header.component';
import SignUp from '../../modules/signUp/SignUp.component';
import SignIn from '../../modules/signIn/SignIn.component';
import Profile from '../../modules/user/Profile.component';
import ChangePassword from '../../modules/changePassword/ChangePassword.component';
import Footer from '../../modules/footer/Footer.component';
import FAQ from '../../modules/faq/FAQ.component';

//stores
import UserStore from '../../modules/user/User.store';

//utils
import bindAll from 'lodash/bindAll';
import History from '../../utils/History';
import Utils from '../../utils/Utils';

let isLoggedIn = Utils.isLoggedIn();

if ((!isLoggedIn) && (location.pathname !== Routes.FAQ)) {
  History.replace(Routes.SIGNIN);
}
if (isLoggedIn && location.pathname === '/') {
  History.replace(Routes.MYPROFILE);
}

class App extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, '_onChange');
    this.state = this._getStateFromStores();
  }
  
  componentWillMount() {
    UserStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange);
  }
  
  _onChange() {
    this.setState(this._getStateFromStores);
  }
  
  _getStateFromStores() {
    return {
      ...UserStore.getState()
    };
  }

  render() {
    return (
      <div className='app-view'>
        <Header />
	{this.props.children}
	<Route path={Routes.SIGNIN} render={() => (
	  this.state.isLoggedIn ? (
	    <Redirect to={Routes.MYPROFILE} />
	  ) : (
	    <SignIn />
	  )
	)} />
	<Route path={Routes.SIGNUP} render={() => (
	  this.state.isLoggedIn ? (
	    <Redirect to={Routes.MYPROFILE} />
	  ) : (
	    <SignUp />
	  )
	)} />
	<Route path={Routes.MYPROFILE} render={() => (
	  this.state.isLoggedIn ? (
	    <Profile />
	  ) : (
	    <Redirect to={Routes.SIGNIN} />
	  )
	)} />
	<Route path={Routes.CHANGE_PASSWORD} render={() => (
	  this.state.isLoggedIn ? (
	    <ChangePassword />
	  ) : (
	    <Redirect to={Routes.SIGNIN} />
	  )
	)} />
	<Route path={Routes.FAQ} render={() => (
	  <FAQ />  
	)} />
	<Footer />
      </div>
    );
  }
}

export default App;