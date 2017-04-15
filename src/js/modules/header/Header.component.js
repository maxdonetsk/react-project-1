import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import {NavLink} from 'react-router-dom';

//constants
import {PROJECT_NAME,
	DEFAULT_LANGUAGE,
	AVAILABLE_LANGUAGES,
	USER_OBJECT_STORAGE_NAME,
	Routes} from '../../common/constants/AppConstants';

// actions
import LogoutActionCreators from '../logout/Logout.actionCreators';

// stores
import UserStore from '../user/User.store';

//utils
import bindAll from 'lodash/bindAll';
import i18n from '../../utils/i18n';
import Utils from '../../utils/Utils';

let currentLanguage = Utils.getBrowserLanguage();

class Header extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, '_onLanguageChange', '_notCurrent', '_onChange', '_logout',
	    '_getDisplayNameAndAvatar');
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
  
  _onLanguageChange(event) {
    if (event.target.name) {
      i18n.changeLanguage(event.target.name, (err, t) => {
	if (!err) {
	  currentLanguage = event.target.name;
	  document.getElementById('footer').click();
	}
      });
    }
  }
  
  _logout(event) {
    event.preventDefault();
    LogoutActionCreators.logout();
  }
  
  _notCurrent(language) {
    return language !== currentLanguage;
  }

  _getDisplayNameAndAvatar() {
    const storageUser = JSON.parse(localStorage.getItem(USER_OBJECT_STORAGE_NAME));
    let displayName = (
      <div className='user-dropdown-wrapper'>
	{`+${storageUser.phone}`}
	<img src={storageUser.profile.profile_image} alt='' className='user-avatar' />
      </div>
    );

    if (storageUser.profile.first_name) {
      displayName = (
	<div className='user-dropdown-wrapper'>
	  {storageUser.profile.first_name}
	  <img src={storageUser.profile.profile_image} alt='' className='user-avatar' />
	</div>
      );
    }
    if (storageUser.profile.last_name) {
      displayName = (
	<div className='user-dropdown-wrapper'>
	  {storageUser.profile.last_name}
	  <img src={storageUser.profile.profile_image} alt='' className='user-avatar' />
	</div>
      );
    }
    if (storageUser.profile.company_name) {
      displayName = (
	<div className='user-dropdown-wrapper'>
	  {storageUser.profile.company_name}
	  <img src={storageUser.profile.profile_image} alt='' className='user-avatar' />
	</div>
      );
    }
    if (storageUser.profile.first_name && storageUser.profile.last_name) {
      displayName = (
	<div className='user-dropdown-wrapper'>
	  {`${storageUser.profile.first_name} ${storageUser.profile.last_name}`}
	  <img src={storageUser.profile.profile_image} alt='' className='user-avatar' />
	</div>
      );
    }
    if (storageUser.profile.first_name && storageUser.profile.last_name && storageUser.profile.company_name) {
      displayName = (
	<div className='user-dropdown-wrapper'>
	  <div className='user-dropdown-title'>{`${storageUser.profile.first_name} ${storageUser.profile.last_name}`}</div>
	  <div className='user-dropdown-subtitle'>{`${storageUser.profile.company_name}`}</div>
	  <img src={storageUser.profile.profile_image} alt='' className='user-avatar user-avatar-aligned' />
	</div>
      );
    }
    return displayName;
  }

  render() {
    return (
      <Navbar collapseOnSelect>
	<Navbar.Header>
	  <Navbar.Brand>
	    <NavLink to='/'>{PROJECT_NAME}</NavLink>
	  </Navbar.Brand>
	  <Navbar.Toggle />
	</Navbar.Header>
	<Navbar.Collapse>
	  {this.state.isLoggedIn ? (
	  <Nav pullRight>
	    <NavDropdown eventKey={4} id='user-dropdown' title={this._getDisplayNameAndAvatar()}>
	      <MenuItem eventKey={4.1} active={location.pathname === Routes.PROFILE}>{i18n.t('Header.MemberMenu.MyProfile')}</MenuItem>
	      {/*<MenuItem eventKey={4.2} active={location.pathname === Routes.CHANGE_PASSWORD}>{i18n.t('Header.MemberMenu.ChangePassword')}</MenuItem>*/}
	      <MenuItem eventKey={4.3} onClick={this._logout}>{i18n.t('Header.MemberMenu.Logout')}</MenuItem>
	      {/*<MenuItem divider />
	      <MenuItem eventKey={4.3}>Administration</MenuItem>*/}
	    </NavDropdown>
	    <NavDropdown eventKey={4} id='languages-dropdown' title={currentLanguage.toUpperCase()}>
	      {AVAILABLE_LANGUAGES.filter(this._notCurrent).map((language, index) => (
		<li key={index}><NavLink to='#' replace name={language} onClick={this._onLanguageChange}>{language.toUpperCase()}</NavLink></li>
	      ))}
	    </NavDropdown>
	  </Nav>
	  ) : (
	  <Nav pullRight>
	    <li><NavLink to={Routes.SIGNIN} activeClassName='active'>{i18n.t('Header.SignIn')}</NavLink></li>
	    <li><NavLink to={Routes.SIGNUP} activeClassName='active'>{i18n.t('Header.SignUp')}</NavLink></li>
	    <NavDropdown eventKey={4} id='languages-dropdown' title={currentLanguage.toUpperCase()}>
	      {AVAILABLE_LANGUAGES.filter(this._notCurrent).map((language, index) => (
		<li key={index}><NavLink to='#' replace name={language} onClick={this._onLanguageChange}>{language.toUpperCase()}</NavLink></li>
              ))}
	    </NavDropdown>
	  </Nav>
	    )}
	</Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;