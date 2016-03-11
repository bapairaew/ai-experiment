import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import s from './AnimatingNumber.scss';
import withStyles from '../../decorators/withStyles';
import { decorateNumber } from '../../utils/currency';
import normalize from '../../utils/normalize';

const cx = classNames.bind(s);

@withStyles(s)
class AnimatingNumber extends Component {

  static propTypes = {
    value: PropTypes.number,
    speed: PropTypes.number
  };

  static defaultProps = {
    value: 0,
    speed: 20
  };

  state = {
    number: 0
  };

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    clearInterval();
  }

  clearInterval() {
    this.interval && clearInterval(this.interval);
    this.interval = false;
  }

  componentWillReceiveProps(nextProps) {
    this.clearInterval();
    let { value, speed } = nextProps;
    let updater = () => {
      const { number } = this.state;
      if (number !== value) {
        const shift = Math.pow(9, (Math.abs(number - value) + '').length - 1);
        this.setState({ number: number < value ? number + shift : number - shift });
      } else {
        this.clearInterval();
      }
    };
    this.interval = setInterval(updater, speed);
  }

  render() {
    const { number } = this.state;
    return (
      <span className={this.props.className}>{decorateNumber(number)}</span>
    );
  }

}

export default AnimatingNumber;
