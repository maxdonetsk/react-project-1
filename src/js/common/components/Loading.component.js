import React from 'react';

class Loading extends React.Component {

  render() {
    return (
	<div className='ball-pulse'>
	  <div></div>
	  <div></div>
	  <div></div>
	</div>
    );
  }
}

export default Loading;