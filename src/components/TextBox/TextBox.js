import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import s from './TextBox.scss';
import withStyles from '../../decorators/withStyles';

const cx = classNames.bind(s);

@withStyles(s)
class TextBox extends Component {

  static propTypes = {
    maxLines: PropTypes.number,
  };

  static defaultProps = {
    maxLines: 1,
  };

  focus() {
    this.refs.textbox.focus();
  }

  render() {
    return (
      this.props.maxLines > 1 ?
        <textarea ref="textbox" {...this.props} className={cx(s.input, this.props.className)} rows={this.props.maxLines} /> :
        <input ref="textbox" {...this.props} className={cx(s.input, this.props.className)} />
    );
  }

}

export default TextBox;
