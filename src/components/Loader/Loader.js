import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import s from './Loader.scss';
import withStyles from '../../decorators/withStyles';

const cx = classNames.bind(s);

@withStyles(s)
class Loader extends Component {
  render() {
    return (
      <div className={cx(s.loader, this.props.className)}>Loading...</div>
    );
  }

}

export default Loader;
