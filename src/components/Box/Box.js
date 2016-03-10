import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import s from './Box.scss';
import withStyles from '../../decorators/withStyles';
import TextBox from '../TextBox';
import Button from '../Button';
import TooltipContainer from '../TooltipContainer';
import Tooltip from '../Tooltip';
import Loader from '../Loader';
import debounce from 'debounce';
import { normalizor, decorateNumber } from '../../utils/currency';

const cx = classNames.bind(s);

@withStyles(s)
class Box extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    onTransfer: PropTypes.func,
    onNameChanged: PropTypes.func,
    onNameChangedDelay: PropTypes.number,
    transferring: PropTypes.bool,
    naming: PropTypes.bool,
    isClient: PropTypes.bool
  };

  static defaultProps = {
    name: '',
    onTransfer: () => {},
    onNameChanged: () => {},
    onNameChangedDelay: 200,
    transferring: false,
    naming: false,
    isClient: false
  };

  state = {
    name: '',
    transfer: null,
    naming: false,
    transferring: false,
    notEnoughMoney: false
  };

  constructor(props) {
    super(props);
    this.state.name = this.props.name;
    this.state.transferring = this.props.transferring;
    this.state.naming = this.props.naming;
    this.debounceOnNameChanged = debounce(this.props.onNameChanged, this.props.onNameChangedDelay);
    this.focus = this.focus.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { name, transferring, naming } = nextProps;
    if (transferring === false) {
      this.setState({ name, transferring, naming, transfer: null });
    } else {
      this.setState({ name, transferring, naming });
    }
  }

  handleTransferChange(event) {
    const number = normalizor(event.target.value);
    const { money } = this.props;
    this.setState({ transfer: number !== NaN ? decorateNumber(number) : '', notEnoughMoney: number > money });
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
    this.debounceOnNameChanged(this.props.id, event.target.value);
  }

  handleSubmit(event) {
    const { transferring, transfer } = this.state;
    const { id, money } = this.props
    const transferAmount = normalizor(transfer);
    event.preventDefault();
    if (transferring || transferAmount > money) {
      return;
    }
    this.props.onTransfer(id, transferAmount);
  }

  focus() {
    this.refs.textbox.refs.component.focus();
  }

  render() {
    const { name, transfer, naming, transferring, notEnoughMoney } = this.state;
    const { isClient, money } = this.props;
    return (
      <div className={s.box}>
        <div className={s.boxContent}>
          {isClient ?
            <TextBox className={cx(s.name, { active: naming })} placeholder="Name"
              value={name} onChange={this.handleNameChange.bind(this)} disabled={naming} /> :
            <h1 className={s.heading}>{name}</h1>}
          <div className={s.currentMoney}>
            <div className={s.money}>{decorateNumber(money || 0)}</div>
            <div className={s.caption}>current money</div>
          </div>
          <form action="" className={s.tranferringMoney} onSubmit={this.handleSubmit.bind(this)}>
            <h2>Transferring money:</h2>
            <TooltipContainer>
              <TextBox ref="textbox" className={cx(s.transfer, { warning: notEnoughMoney })} placeholder="£"
              value={transfer} onChange={this.handleTransferChange.bind(this)} disabled={transferring} />
              { notEnoughMoney ? <Tooltip className={s.warningTooltip}>Not enough money</Tooltip> : null }
            </TooltipContainer>
            <Button className={s.button} disabled={transferring}>
              { transferring ? <Loader /> : <span>Transfer</span> }
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default Box;
