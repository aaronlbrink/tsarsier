import React from 'react';

export default class PureCanvas extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <canvas
        width="900"
        height="900"
        ref={node =>
          node ? this.props.contextRef(node.getContext('2d')) : null
        }
      />
    );
  }
}
