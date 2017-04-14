import React from 'react';
import {Route, Redirect} from 'react-router';

//constants
import {Routes} from '../../common/constants/AppConstants';

//components
import Header from '../../modules/header/Header.component';
import SignUp from '../../modules/signUp/SignUp.component';
import SignIn from '../../modules/signIn/SignIn.component';
import Profile from '../../modules/user/Profile.component';

//stores
import UserStore from '../../modules/user/User.store';

//utils
import bindAll from 'lodash/bindAll';
import History from '../../utils/History';
import Utils from '../../utils/Utils';

let isLoggedIn = Utils.isLoggedIn();

isLoggedIn ? History.replace(Routes.PROFILE) : History.replace(Routes.SIGNIN);

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
      <div className='height-100'>
        <Header />
        {this.props.children}
	<Route path={Routes.SIGNIN} render={() => (
	  this.state.isLoggedIn ? (
	    <Redirect to={Routes.PROFILE} />
	  ) : (
	    <SignIn />
	  )
	)} />
	<Route path={Routes.SIGNUP} render={() => (
	  this.state.isLoggedIn ? (
	    <Redirect to={Routes.PROFILE} />
	  ) : (
	    <SignUp />
	  )
	)} />
	<Route path={Routes.PROFILE} render={() => (
	  this.state.isLoggedIn ? (
	    <Profile />
	  ) : (
	    <Redirect to={Routes.SIGNIN} />
	  )
	)} />
      </div>
    );
  }
}

export default App;