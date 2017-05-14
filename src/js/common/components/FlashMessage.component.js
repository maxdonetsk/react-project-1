import React, {PropTypes} from 'react';

//react-bootstrap
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

//constants
import {Flashes} from '../constants/AppConstants';

class FlashMessage extends React.Component {

  render() {
    let glyph;
    if (this.props.state === Flashes.SUCCESS) {
      glyph = 'ok-sign';
    }
    if (this.props.state === Flashes.ERROR) {
      glyph = 'exclamation-sign';
    }

    return (
	<span className={'flash-message ' + this.props.state}>
	  <Glyphicon glyph={glyph} /> {this.props.message}
	</span>
    );
  }
}

FlashMessage.propTypes = {
    message: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired
};

export default FlashMessage;