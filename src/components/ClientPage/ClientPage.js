import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import s from './ClientPage.scss';
import withStyles from '../../decorators/withStyles';
import store from '../../stores';
import getPlayerById from '../../utils/getPlayerById';
import BankStack from '../BankStack';
import AnimatingNumber from '../AnimatingNumber';
import { decorateNumber } from '../../utils/currency';
import isNewGame from '../../utils/isNewGame';

const title = 'Client';

const cx = classNames.bind(s);

const TRANFER_TIME = 1000;

@withStyles(s)
class ClientPage extends Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  static propTypes = {
    id: PropTypes.string,
    position: PropTypes.string
  };

  static defaultProps = {
    id: 'client',
    position: 'left'
  };

  state = {
    id: '',
    round: 0,
    me: { money: 0 },
    opponent: { money: 0 },
    isMyTurn: false,
    transferAmount: 0,
    transferring: false,
    newGame: false
  };

  constructor(props) {
    super(props);
    this.state.id = this.props.id;
  }

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  getTransferAmount(prev, current) {
    const myDiff = Math.abs(prev.me.money - current.me.money);
    const opponentDiff = Math.abs(prev.opponent.money - current.opponent.money);
    return myDiff < opponentDiff ? myDiff : opponentDiff;
    //return 0;
  }

  componentDidMount() {
    const { id } = this.state;
    this.unsubscribe = store.subscribe(() => {
      // TODO: try to use css to do the animation instead!!
      const game = store.getState();
      let isMyTurn = game.roundPlayer === id;
      const transferring = game.round > this.state.round && this.state.round !== 0;
      let { round, endedTime } = game;

      let me = getPlayerById(game, id);
      setTimeout(() => {
        const state = { me: me };
        if (isMyTurn) {
          state.isMyTurn = isMyTurn;
          state.round = game.round;
        }
        this.setState(state);
      }, (transferring && isMyTurn) ? TRANFER_TIME : 0);

      let opponent = me === game.player1 ? game.player2 : game.player1;
      setTimeout(() => {
        const state = { opponent: opponent };
        if (!isMyTurn) {
          state.isMyTurn = isMyTurn;
          state.round = game.round;
        }
        this.setState(state);
      }, (!transferring || isMyTurn) ? 0 : TRANFER_TIME);

      setTimeout(() => {
        this.setState({ transferring: false });
      }, TRANFER_TIME + 1000);

      this.setState({
        transferring: transferring,
        endedTime: endedTime,
        newGame: isNewGame(game, this.state),
        transferAmount: this.getTransferAmount(this.state, { me, opponent })
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { isMyTurn, opponent, me, transferring, round, transferAmount, endedTime, newGame } = this.state;
    const { position } = this.props;
    const isLeftMain = position === 'left';
    const left = isLeftMain ? me : opponent;
    const right = isLeftMain ? opponent : me;
    return (
      <div className={s.container}>
        <div className={s.mainContainer}>
          <div className={cx(s.bankContainer, { main: isLeftMain, active: !isMyTurn })}>
            <h2 className={cx(s.subHeading, { active: isMyTurn && isLeftMain })}>Your turn!</h2>
            <BankStack className={cx(s.stack, { minor: !isLeftMain })} amount={left.money} direction="right" />
          </div>
          <div className={cx(s.divider, { right: isLeftMain })}>
            <div className={s.circle}>
              <div className={s.smallText}>Round:</div>
              <div>{ round }</div>
            </div>
          </div>
          <div className={cx(s.bankContainer, { main: !isLeftMain, active: isMyTurn })}>
            <h2 className={cx(s.subHeading, { active: isMyTurn && !isLeftMain })}>Your turn!</h2>
            <BankStack className={cx(s.stack, { minor: isLeftMain })} amount={right.money} />
          </div>
        </div>
        <div className={cx(s.transferer, { transferring: transferring })}>
          <div className={s.wrapper}>
            <span className={s.highlight}>Transferring: </span>
            <span>{decorateNumber(transferAmount)}</span>
            <span>x</span>
            <span>3</span>
            <span>=</span>
            <AnimatingNumber className={s.highlight} value={transferAmount * 3}></AnimatingNumber>
          </div>
        </div>
        <div className={cx(s.overlay, { active: !!endedTime })}>
          <div className={s.dialog}>
            <h1>Game Over!</h1>
            <h3>Your money is <b>{ me.money }</b></h3>
            <h3>Your team money is <b>{ me.money + opponent.money }</b></h3>
          </div>
        </div>
        <div className={cx(s.overlay, { active: !!newGame })}>
          <div className={cx(s.dialog, s.fullScreen)}>
            <h1>Welcome!</h1>
            <h3>the game is starting soon...</h3>
          </div>
        </div>
      </div>
    );
  }
}

export default ClientPage;
