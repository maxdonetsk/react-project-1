import React, {PropTypes} from 'react';
import {NavLink} from 'react-router-dom';

//react-bootstrap
import Panel from 'react-bootstrap/lib/Panel';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Breadcrumb from 'react-bootstrap/lib/Breadcrumb';

//constants
import {Routes} from '../../common/constants/AppConstants';

//components
import Loading from '../../common/components/Loading.component';

// actions
import NewsActionCreators from './News.actionCreators';

// stores
import NewsStore from './News.store';

//utils
import bindAll from 'lodash/bindAll';
import i18n from '../../utils/i18n';
import Utils from '../../utils/Utils';

class New extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, '_onChange', '_getContent');
    this.state = this._getStateFromStores();
  }

  componentDidMount() {
    NewsActionCreators.getNew(this.props.id);
  }

  componentWillMount() {
    NewsStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    NewsStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(this._getStateFromStores);
  }
  
  _getStateFromStores() {
    return {
      ...NewsStore.getCurrentItem()
    };
  }

  _getContent() {
    if (this.state.loading) {
      return (
	<div className='loading-theme text-center'>
	  <Loading />
	</div>
      )
    }
    return (
      <Row>
	<Col sm={3}>
	  <img className='img-responsive' src={this.state.image} alt={this.state.name} />
	</Col>
	<Col sm={9}>
	  <h4>{this.state.name}</h4>
	  <h6 className='text-muted'>{this.state.news_date}</h6>
	  <div dangerouslySetInnerHTML={{__html: this.state.news_text}} />
	</Col>
      </Row>
    )
  }

  render() {
    return (
      <Grid className='news flex-1'>
	<Row>
	  <Col xs={12}>
	    <Breadcrumb>
	      <li><NavLink to={Routes.NEWS}>{i18n.t('Footer.News')}</NavLink></li>
	      <Breadcrumb.Item active>
		{this.state.name}
	      </Breadcrumb.Item>
	    </Breadcrumb>
	  </Col>
	</Row>
	<Row>
	  <Col xs={12}>
	    <Panel header={this.state.name} className='news-panel'>
	      <Row>
		<Col xs={12}>
		  {this._getContent()}
		</Col>
	      </Row>
	    </Panel>
	  </Col>
	</Row>
      </Grid>
    );
  }
}

New.propTypes = {
  id: PropTypes.string.isRequired,
};

export default New;