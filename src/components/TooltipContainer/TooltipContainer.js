import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import s from './TooltipContainer.scss';
import withStyles from '../../decorators/withStyles';

const cx = classNames.bind(s);

@withStyles(s)
class TooltipContainer extends Component {
  render() {
    return (
      <div {...this.props} className={cx(s.tooltipContainer, this.props.className)}>
        {this.props.children}
      </div>
    );
  }

}

export default TooltipContainer;
