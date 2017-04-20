import React from 'react';
import {NavLink} from 'react-router-dom';

//react-bootstrap
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

//constants
import {PROJECT_NAME,
	DEFAULT_LANGUAGE,
	AVAILABLE_LANGUAGES,
	USER_OBJECT_STORAGE_NAME,
	Routes} from '../../common/constants/AppConstants';

// actions
import LogoutActionCreators from '../logout/Logout.actionCreators';
import HeaderActionCreators from './Header.actionCreators';

// stores
import UserStore from '../user/User.store';
import HeaderStore from './Header.store';

//utils
import bindAll from 'lodash/bindAll';
import i18n from '../../utils/i18n';
import Utils from '../../utils/Utils';
import History from '../../utils/History';

let currentLanguage = Utils.getBrowserLanguage();

class Header extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, '_onLanguageChange', '_notCurrent', '_onChange', '_logout',
	    '_handleMenuItemSelect', '_getDisplayNameAndAvatar',
	    '_getNavbarToggleIcon', '_onNavbarToggleClick');
    this.state = this._getStateFromStores();
  }

  componentWillMount() {
    UserStore.addChangeListener(this._onChange);
    HeaderStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange);
    HeaderStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(this._getStateFromStores);
  }

  _getStateFromStores() {
    return {
      ...UserStore.getState(),
      ...HeaderStore.getState()
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

  _handleMenuItemSelect(event) {
    event.preventDefault();
    History.replace(event.target.name);
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

  _getNavbarToggleIcon() {
    return this.state.isNavbarCollapsed ? (
      <svg className='navbar-icon' preserveAspectRatio='xMinYMin meet' viewBox='0 0 20 20'>
	  <path d='M17.5 6h-15c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h15c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z'></path>
	  <path d='M17.5 11h-15c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h15c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z'></path>
	  <path d='M17.5 16h-15c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h15c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z'></path>
      </svg>
    ) : (
      <svg className='navbar-icon' preserveAspectRatio='xMinYMin meet' viewBox='0 0 20 20'>
	  <path d='M10.707 10.5l5.646-5.646c0.195-0.195 0.195-0.512 0-0.707s-0.512-0.195-0.707 0l-5.646 5.646-5.646-5.646c-0.195-0.195-0.512-0.195-0.707 0s-0.195 0.512 0 0.707l5.646 5.646-5.646 5.646c-0.195 0.195-0.195 0.512 0 0.707 0.098 0.098 0.226 0.146 0.354 0.146s0.256-0.049 0.354-0.146l5.646-5.646 5.646 5.646c0.098 0.098 0.226 0.146 0.354 0.146s0.256-0.049 0.354-0.146c0.195-0.195 0.195-0.512 0-0.707l-5.646-5.646z'></path>
      </svg>
    );
  }

  _onNavbarToggleClick() {
    HeaderActionCreators.changeNavbarToogleIcon(this.state.isNavbarCollapsed);
  }

  render() {
    return (
      <Navbar collapseOnSelect>
	<Navbar.Header>
	  <Navbar.Brand>
	    <NavLink to={this.state.isLoggedIn ? Routes.DEFAULT_ROUTE_FOR_MEMBER : Routes.DEFAULT_ROUTE_FOR_GUEST}>{PROJECT_NAME}</NavLink>
	  </Navbar.Brand>
	  <Navbar.Toggle children={this._getNavbarToggleIcon()} onClick={this._onNavbarToggleClick} />
	</Navbar.Header>
	<Navbar.Collapse>
	  {this.state.isLoggedIn ? (
	  <Nav pullRight>
	    <NavDropdown eventKey={4} id='user-dropdown' title={this._getDisplayNameAndAvatar()}>
	      <MenuItem
		eventKey={4.1}
		active={location.pathname === Routes.MYPROFILE}
		name={Routes.MYPROFILE}
		onClick={this._handleMenuItemSelect}>
		  {i18n.t('Header.MemberMenu.MyProfile')}</MenuItem>
	      <MenuItem
		eventKey={4.2}
		active={location.pathname === Routes.CHANGE_PASSWORD}
		name={Routes.CHANGE_PASSWORD}
		onClick={this._handleMenuItemSelect}>
		  {i18n.t('Header.MemberMenu.ChangePassword')}</MenuItem>
	      <MenuItem
		eventKey={4.3}
		onClick={this._logout}>
		  {i18n.t('Header.MemberMenu.Logout')}</MenuItem>
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