import React from 'react';
import {Link} from 'react-router-dom';

//react-bootstrap
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Breadcrumb from 'react-bootstrap/lib/Breadcrumb';
import Panel from 'react-bootstrap/lib/Breadcrumb';
import Media from 'react-bootstrap/lib/Media';

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

class News extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, '_onChange', '_getStateFromStores', '_getContent');
    this.state = this._getStateFromStores();
  }

  componentDidMount() {
    NewsActionCreators.getNews();
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
      ...NewsStore.getState()
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
    if (this.state.NewsItems.length) {
      return (
	<Media.List>
	  {this.state.NewsItems.map(item => {
	    return (
	      <Media.ListItem key={item.id}>
		<Media.Left>
		  <Link
		    to={`${Routes.NEWS}/${item.id}`}
		    style={{backgroundImage: `url(${item.image})`}}
		    title={item.name}
		    className='news-list-thumbnail'/>
		</Media.Left>
		<Media.Body>
		  <Media.Heading><Link to={`${Routes.NEWS}/${item.id}`}>{item.name}</Link></Media.Heading>
		  <h6 className='text-muted'>{item.news_date}</h6>
		  <div dangerouslySetInnerHTML={{__html: item.short_description}} />
		</Media.Body>
	      </Media.ListItem>
	    )})}
	</Media.List>
      )
    }
    return (
      <div className='text-center'>
	{i18n.t('News.NoData')}
      </div>
    )
  }

  render() {
    return (
      <Grid className='news flex-1'>
	  <Row>
	    <Col xs={12}>
	      <Breadcrumb>
		<Breadcrumb.Item active>
		  {i18n.t('Footer.News')}
		</Breadcrumb.Item>
	      </Breadcrumb>
	    </Col>
	  </Row>
	  <Row>
	    <Col xs={12}>
	      <Panel header={i18n.t('Footer.News')} className='news-panel'>
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

export default News;