import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import s from './Button.scss';
import withStyles from '../../decorators/withStyles';

const cx = classNames.bind(s);

@withStyles(s)
class Button extends Component {
  render() {
    return (
      <button {...this.props} className={cx(s.button, this.props.className)}>{this.props.children}</button>
    );
  }

}

export default Button;
