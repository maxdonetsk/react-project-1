import React from 'react';

//react-bootstrap
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Image from 'react-bootstrap/lib/Image';
import Form from 'react-bootstrap/lib/Form';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Breadcrumb from 'react-bootstrap/lib/Breadcrumb';

//constants
import {USER_ID_COOKIE_NAME, USER_OBJECT_STORAGE_NAME} from '../../common/constants/AppConstants';

//components
import Loading from '../../common/components/Loading.component';

// actions
import ProfileActionCreators from './Profile.actionCreators';

// stores
import UserStore from './User.store';

//utils
import bindAll from 'lodash/bindAll';
import i18n from '../../utils/i18n';
import Utils from '../../utils/Utils';

let userAvatarFile = null;

class Profile extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, '_handleFieldChange', '_handleFileChange', '_onChange',
	    '_handleSubmit', '_handleReset', '_getStatusIcon',
	    '_getStatusColor', '_getDisplayName');
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

  _onEditClick() {
    ProfileActionCreators.onEditClick();
  }

  _getStatusIcon(status) {
    if (status === 10) {
      return 'ok';
    }
    if (status === 1) {
      return 'warning-sign';
    }
    if (status === 0) {
      return 'remove';
    }
    return 'question-sign';
  }

  _getStatusColor(status) {
    if (status === 10) {
      return 'text-success';
    }
    if (status === 1) {
      return 'text-warning';
    }
    if (status === 0) {
      return 'text-danger';
    }
      return null;
  }

  _handleFieldChange(event) {
    const data = {[event.target.name]: event.target.value};
    ProfileActionCreators.onFieldChange(data);
  }

  _handleFileChange(event) {
    userAvatarFile = document.getElementById('profile_image').files[0];
    let userAvatarPreview = userAvatarFile;
    const reader = new FileReader();
    reader.onloadend = function () {
      userAvatarPreview = reader.result;
      ProfileActionCreators.changeUserAvatarPreview(userAvatarPreview);
    }
    reader.readAsDataURL(userAvatarPreview);
  }

  _handleSubmit(event) {
    event.preventDefault();
    const {first_name, last_name, company_name, email, type, sub_type, activities, tax} = this.state.user.profile;
    ProfileActionCreators.updateCurrentUserProfile({first_name, last_name, company_name, email, type, sub_type, activities, tax}, userAvatarFile);
  }

  _handleReset(event) {
    event.preventDefault();
    const data = JSON.parse(localStorage.getItem(USER_OBJECT_STORAGE_NAME));
    ProfileActionCreators.getCurrentUserProfile(data);
    this.setState({editProfileMode: false});
  }

  _getDisplayName() {
    const storageUser = JSON.parse(localStorage.getItem(USER_OBJECT_STORAGE_NAME));
    let displayName = `+${storageUser.phone}`;

    if (storageUser.profile.first_name) {
      displayName = storageUser.profile.first_name;
    }
    if (storageUser.profile.last_name) {
      displayName = storageUser.profile.last_name;
    }
    if (storageUser.profile.company_name) {
      displayName = storageUser.profile.company_name;
    }
    if (storageUser.profile.first_name && storageUser.profile.last_name) {
      displayName = `${storageUser.profile.first_name} ${storageUser.profile.last_name}`;
    }
    if (storageUser.profile.first_name && storageUser.profile.last_name && storageUser.profile.company_name) {
      displayName = `${storageUser.profile.first_name} ${storageUser.profile.last_name}, ${storageUser.profile.company_name}`;
    }
    return displayName;
  }

  render() {
    const editProfileMode = this.state.editProfileMode;
    const user = this.state.user;
    return (
	<Grid className='profile flex-1'>
	  <Row>
	    <Col xs={12}>
	      <Breadcrumb>
		<Breadcrumb.Item active>
		  {i18n.t('Header.MemberMenu.MyProfile')}
		</Breadcrumb.Item>
	      </Breadcrumb>
	    </Col>
	  </Row>
	  <Row>
	    <Col xs={12}>
	      <div className='panel panel-default profile-panel'>
		<div className='panel-heading clearfix'>
		  <div className='pull-left'>{this._getDisplayName()}</div>
		  {(Utils.getCookieItem(USER_ID_COOKIE_NAME) === user.profile[USER_ID_COOKIE_NAME] && !this.state.editProfileMode) &&
		    <div className='pull-right'>
		      <Button type='button'
			      bsStyle='primary'
			      onClick={this._onEditClick}>
			{i18n.t('Profile.editProfile')}
		      </Button>
		    </div>
		  }
		</div>
		<div className='panel-body'>
		  <Row>
		    <Col md={6} mdOffset={3}>
		      <Form
			onSubmit={this._handleSubmit}
			onReset={this._handleReset}>
			<FormGroup
			  key={1}
			  controlId='profile_status'>
			  <ControlLabel>{i18n.t('Profile.status')}</ControlLabel>
			  <FormControl.Static className={this._getStatusColor(user.status)}>
			    <Glyphicon glyph={this._getStatusIcon(user.status)} /> {user.status_description}
			  </FormControl.Static>
			</FormGroup>
			<FormGroup
			  key={2}
			  controlId='phone'>
			  <ControlLabel>{i18n.t('Profile.phoneNumber')}</ControlLabel>
			  <FormControl.Static>
			    {`+${user.phone}`}
			  </FormControl.Static>
			</FormGroup>
			<FormGroup
			  key={3}
			  controlId='profile_image'>
			  <ControlLabel>{i18n.t('Profile.profileImage')}</ControlLabel>
			  <div className='form-group'>
			    <Image
			      className='profile-avatar'
			      src={this.state.userAvatarPreview || user.profile.profile_image}
			      htmlFor='profile_image'
			      rounded />
			  </div>
			  {editProfileMode &&
			    <FormControl
			      type='file'
			      name='profile_image'
			      id='profile_image'
			      onChange={event => this._handleFileChange(event)} />
			  }
			</FormGroup>
			<FormGroup
			  key={4}
			  controlId='first_name'>
			  <ControlLabel>{i18n.t('Profile.firstName')}</ControlLabel>
			  {editProfileMode ? (
			    <FormControl
			      type='text'
			      value={user.profile.first_name}
			      name='first_name'
			      placeholder={i18n.t('Profile.firstName')}
			      onChange={event => this._handleFieldChange(event)} />			
			    ) : (
			    <FormControl.Static>
			      {user.profile.first_name ? user.profile.first_name : i18n.t('Profile.notAvailable')}
			    </FormControl.Static>
			    )
			  }
			</FormGroup>
			<FormGroup
			  key={5}
			  controlId='last_name'>
			  <ControlLabel>{i18n.t('Profile.lastName')}</ControlLabel>
			  {editProfileMode ? (
			    <FormControl
			      type='text'
			      value={user.profile.last_name}
			      name='last_name'
			      placeholder={i18n.t('Profile.lastName')}
			      onChange={event => this._handleFieldChange(event)} />			
			    ) : (
			    <FormControl.Static>
			      {user.profile.last_name ? user.profile.last_name : i18n.t('Profile.notAvailable')}
			    </FormControl.Static>
			    )
			  }
			</FormGroup>
			<FormGroup
			  key={6}
			  controlId='company_name'>
			  <ControlLabel>{i18n.t('Profile.companyName')}</ControlLabel>
			  {editProfileMode ? (
			    <FormControl
			      type='text'
			      value={user.profile.company_name}
			      name='company_name'
			      placeholder={i18n.t('Profile.companyName')}
			      onChange={event => this._handleFieldChange(event)} />			
			    ) : (
			    <FormControl.Static>
			      {user.profile.company_name ? user.profile.company_name : i18n.t('Profile.notAvailable')}
			    </FormControl.Static>
			    )
			  }
			</FormGroup>
			<FormGroup
			  key={7}
			  controlId='email'>
			  <ControlLabel>{i18n.t('Profile.email')}</ControlLabel>
			  {editProfileMode ? (
			    <FormControl
			      type='email'
			      value={user.profile.email}
			      name='email'
			      placeholder={i18n.t('Profile.email')}
			      onChange={event => this._handleFieldChange(event)} />			
			    ) : (
			    <FormControl.Static>
			      {user.profile.email ? user.profile.email : i18n.t('Profile.notAvailable')}
			    </FormControl.Static>
			    )
			  }
			</FormGroup>
			<FormGroup
			  key={8}
			  controlId='type'>
			  <ControlLabel>{i18n.t('Profile.type')}</ControlLabel>
			  {editProfileMode ? (
			    <FormControl
			      componentClass='select'
			      value={user.profile.type}
			      name='type'
			      onChange={event => this._handleFieldChange(event)}>
			      {user.profile.params.types.map((item) => {
				return (
				<option
				  value={item.id}
				  key={item.id}>{item.name}
				</option>);
			      })}
			    </FormControl>
			    ) : (
			    <FormControl.Static>
			      {user.profile.type_description ? user.profile.type_description : i18n.t('Profile.notAvailable')}
			    </FormControl.Static>
			    )
			  }
			</FormGroup>
			<FormGroup
			  key={9}
			  controlId='sub_type'>
			  <ControlLabel>{i18n.t('Profile.subtype')}</ControlLabel>
			  {editProfileMode ? (
			    <FormControl
			      componentClass='select'
			      value={user.profile.sub_type}
			      name='sub_type'
			      onChange={event => this._handleFieldChange(event)}>
			      {user.profile.params.sub_types.map((item) => {
				return (
				<option
				  value={item.id}
				  key={item.id}>{item.name}
				</option>);
			      })}
			    </FormControl>
			    ) : (
			    <FormControl.Static>
			      {user.profile.sub_type_description ? user.profile.sub_type_description : i18n.t('Profile.notAvailable')}
			    </FormControl.Static>
			    )
			  }
			</FormGroup>
			<FormGroup
			  key={10}
			  controlId='activities'>
			  <ControlLabel>{i18n.t('Profile.activity')}</ControlLabel>
			  {editProfileMode ? (
			    <FormControl
			      componentClass='select'
			      value={user.profile.activities}
			      name='activities'
			      onChange={event => this._handleFieldChange(event)}>
			      {user.profile.params.activities.map((item) => {
				return (
				<option
				  value={item.id}
				  key={item.id}>{item.name}
				</option>);
			      })}
			    </FormControl>
			    ) : (
			    <FormControl.Static>
			      {user.profile.activities_description ? user.profile.activities_description : i18n.t('Profile.notAvailable')}
			    </FormControl.Static>
			    )
			  }
			</FormGroup>
			<FormGroup
			  key={11}
			  controlId='tax'>
			  <ControlLabel>{i18n.t('Profile.tax')}</ControlLabel>
			  {editProfileMode ? (
			    <FormControl
			      componentClass='select'
			      value={user.profile.tax}
			      name='tax'
			      onChange={event => this._handleFieldChange(event)}>
			      {user.profile.params.taxes.map((item) => {
				return (
				<option
				  value={item.id}
				  key={item.id}>{item.name}
				</option>);
			      })}
			    </FormControl>
			    ) : (
			    <FormControl.Static>
			      {user.profile.tax_description ? user.profile.tax_description : i18n.t('Profile.notAvailable')}
			    </FormControl.Static>
			    )
			  }
			</FormGroup>
			{editProfileMode &&
			  <div>
			    <Button type='submit' bsStyle='success' disabled={this.state.loading}>
			      {this.state.loading ? <Loading /> : i18n.t('Profile.submit')}
			    </Button>
			    <Button type='reset' bsStyle='default'>
			      {i18n.t('Profile.reset')}
			    </Button>
			  </div>
			}
		      </Form>
		    </Col>
		  </Row>
		</div>
	      </div>
	    </Col>
	  </Row>
	</Grid>
    );
  }
}

export default Profile;