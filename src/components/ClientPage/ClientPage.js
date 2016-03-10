import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import s from './ClientPage.scss';
import withStyles from '../../decorators/withStyles';
import store from '../../stores';
import getPlayerById from '../../utils/getPlayerById';
import { decorateNumber } from '../../utils/currency';
import BankStack from '../BankStack';

const title = 'Client';

const cx = classNames.bind(s);

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
    me: {},
    opponent: {},
    isMyTurn: false,
    transferring: false
  };

  constructor(props) {
    super(props);
    this.state.id = this.props.id;
  }

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  componentDidMount() {
    const { id } = this.state;
    this.unsubscribe = store.subscribe(() => {
      // TODO: try to use css to do the animation instead!!
      const game = store.getState();
      let isMyTurn = game.roundPlayer === id;

      let me = getPlayerById(game, id);
      setTimeout(() => {
        const state = { me: me };
        if (isMyTurn) {
          state.isMyTurn = isMyTurn;
          state.transferring = false;
        }
        this.setState(state);
      }, isMyTurn ? 2000 : 0);

      let opponent = me === game.player1 ? game.player2 : game.player1;
      setTimeout(() => {
        const state = { opponent: opponent };
        if (!isMyTurn) {
          state.isMyTurn = isMyTurn;
          state.transferring = false;
        }
        this.setState(state);
      }, isMyTurn ? 0 : 2000);

      this.setState({ transferring: true });
    }.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { isMyTurn, opponent, me, transferring } = this.state;
    const { position } = this.props;
    const isLeftMain = position === 'left';
    const left = isLeftMain ? me : opponent;
    const right = isLeftMain ? opponent : me;
    return (
      <div className={s.container}>
        <div className={cx({ bankContainer: true, transferring: true, main: isLeftMain, active: !isMyTurn })}>
          <h2 className={cx(s.subHeading, { active: isMyTurn && isLeftMain })}>Your turn!</h2>
          <BankStack className={cx({ stack: true, minor: !isLeftMain })} amount={left.money} direction="right" />
        </div>
        <div className={s.divider}>
          <div className={s.circle}></div>
        </div>
        <div className={cx({ bankContainer: true, transferring: true, main: !isLeftMain, active: isMyTurn })}>
          <h2 className={cx(s.subHeading, { active: isMyTurn && !isLeftMain })}>Your turn!</h2>
          <BankStack className={cx({ stack: true, minor: isLeftMain })} amount={right.money} />
        </div>
      </div>
    );
  }
}

export default ClientPage;
