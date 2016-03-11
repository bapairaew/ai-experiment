import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import s from './BankStack.scss';
import withStyles from '../../decorators/withStyles';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import range from '../../utils/range';
import AnimatingNumber from '../AnimatingNumber';

const cx = classNames.bind(s);

const BANK_MARGIN = 5;

@withStyles(s)
class BankStack extends Component {
  static propTypes = {
    amount: PropTypes.number,
  };

  static defaultProps = {
    amount: 10,
  };

  state = {
    amount: 10
  };

  constructor(props) {
    super(props);
    this.state.amount = this.props.amount;
  }

  notes = [1000000, 500000, 100000, 50000, 10000, 5000, 1000, 500, 100, 50, 10, 5, 1];

  componentWillReceiveProps(nextProps) {
    const { amount } = nextProps;
    this.setState({ amount: amount });
  }

  calculateNotes(money) {
    const notes = [];
    do {
      for (let i = 0; i < this.notes.length; i++) {
        const value = this.notes[i];
        if (money >= value) {
          notes.push(value);
          money -= value;
          break;
        }
      }
    } while(money > 0)
    return notes;//[1000000, 500000, 100000, 50000, 10000, 5000, 1000, 500, 100, 50, 10, 5, 1];
  }

  getBankText(type) {
    switch (type) {
      case 1000000:
        return '1M';
      case 500000:
        return '500K';
      case 100000:
        return '100K';
      case 50000:
        return '50K';
      case 10000:
        return '10K';
      case 5000:
        return '5K';
      case 1000:
        return '1K';
    }

    return type;
  }

  getBankStripes(type) {
    let length = 0;
    switch (type) {
      case 1000000:
        return range(0, 13);
      case 500000:
        return range(0, 12);
      case 100000:
        return range(0, 11);
      case 50000:
        return range(0, 10);
      case 10000:
        return range(0, 9);
      case 5000:
        return range(0, 8);
      case 1000:
        return range(0, 7);
      case 500:
        return range(0, 6);
      case 100:
        return range(0, 5);
      case 50:
        return range(0, 4);
      case 10:
        return range(0, 3);
      case 5:
        return range(0, 2);
      case 1:
        return range(0, 1);
    }

    return range(0, 0);
  }

  generateNote(type, index) {
    return (
      <div key={type + '-' + index} className={s.note}
        style={{margin: (index * BANK_MARGIN) + 'px 0', zIndex: -1 * index}}>
        <div className={s.stripes}>
          {this.getBankStripes(type).map(() => <div className={s.stripe}></div>)}
        </div>
      </div>
    );
  }

  render() {
    const { amount } = this.state;
    const notes = this.calculateNotes(amount);
    return (
      <ReactCSSTransitionGroup {...this.props} component="div"
        transitionEnterTimeout={500} transitionLeaveTimeout={500}
        transitionName={{
          enter: s.noteEnter,
          enterActive: s.noteEnterActive,
          leave: s.noteLeave,
          leaveActive: s.noteLeaveActive
        }}
        className={cx(s.stack, this.props.className)}>
        {notes.reverse().map(this.generateNote.bind(this))}
        <div key="total" className={s.total}>
          <AnimatingNumber value={amount}></AnimatingNumber>
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}

export default BankStack;
