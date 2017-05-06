import React from 'react';

//react-bootstrap
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Breadcrumb from 'react-bootstrap/lib/Breadcrumb';

//constants
import {PROJECT_NAME,
	DEFAULT_LANGUAGE,
	AVAILABLE_LANGUAGES,
	USER_OBJECT_STORAGE_NAME,
	Routes} from '../../common/constants/AppConstants';

//components
import Loading from '../../common/components/Loading.component';

// actions
import FAQActionCreators from './FAQ.actionCreators';

// stores
import FAQStore from './FAQ.store';

//utils
import bindAll from 'lodash/bindAll';
import i18n from '../../utils/i18n';

class FAQ extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, '_onChange', '_getStateFromStores', '_notCurrent', '_getContent',
	    '_getUserTypeTitle', '_changeFAQFilter');
    this.state = this._getStateFromStores();
  }

  componentDidMount() {
    FAQActionCreators.getFAQ();
  }

  componentWillMount() {
    FAQStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    FAQStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(this._getStateFromStores);
  }

  _getStateFromStores() {
    return {
      ...FAQStore.getState()
    };
  }

  _notCurrent(userType) {
    return userType.id !== this.state.currentUserType;
  }
  
  _getContent() {
    if (this.state.loading) {
      return (
	<div className='loading-theme text-center'>
	  <Loading />
	</div>
      )
    }
    if (this.state.FAQItems.length) {
      return (
	this.state.FAQItems.map(item => {
	  return (
	    <div key={item.id} className='faq-question-answer-wrapper'>
	      <div className='faq-question'>{item.question}</div>
	      <div className='faq-answer' dangerouslySetInnerHTML={{__html: item.answer}} />
	    </div>
	  )
	})
      )
    }
    return (
      <div className='text-center'>
	{i18n.t('FAQ.NoData')}
      </div>
    )
  }

  _getUserTypeTitle() {
    let title = '';
    this.state.userTypes.forEach(item => {
      title = (item.id === this.state.currentUserType) ? item.name : title;
    });
    return title;
  }

  _changeFAQFilter(userType) {
    FAQActionCreators.getFAQ(userType);
  }

  render() {
    return (
      <Grid className='faq flex-1'>
	  <Row>
	    <Col xs={12}>
	      <Breadcrumb>
		<Breadcrumb.Item active>
		  {i18n.t('Footer.FAQ')}
		</Breadcrumb.Item>
	      </Breadcrumb>
	    </Col>
	  </Row>
	  <Row>
	    <Col xs={12}>
	      <div className='panel panel-default faq-panel'>
		<div className='panel-heading clearfix'>
		  <div className='pull-left'>{i18n.t('Footer.FAQ')}</div>
		  {this.state.userTypes &&
		    <div className='pull-right'>
		      <Dropdown id='usertypes-filter'>
			<Dropdown.Toggle bsSize='xsmall'>
			  <Glyphicon glyph='filter' />
			  <span className='usertypes-filter-title'>{this._getUserTypeTitle(this.state.currentUserType)}</span>
			</Dropdown.Toggle>
			<Dropdown.Menu>
			  {this.state.userTypes.filter(this._notCurrent).map((item) => (
			    <MenuItem
			      key={item.id}
			      eventKey={item.id}
			      onSelect={this._changeFAQFilter}>{item.name}</MenuItem>
			  ))}
			</Dropdown.Menu>
		      </Dropdown>
		    </div>
		  }
		</div>
		<div className='panel-body'>
		  <Row>
		    <Col xs={12}>
		      {this._getContent()}
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

export default FAQ;