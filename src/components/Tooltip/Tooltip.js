import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import s from './Tooltip.scss';
import withStyles from '../../decorators/withStyles';

const cx = classNames.bind(s);

@withStyles(s)
class Tooltip extends Component {
  render() {
    return (
      <div {...this.props} className={cx(s.tooltip, this.props.className)}>
        {this.props.children}
      </div>
    );
  }

}

export default Tooltip;
