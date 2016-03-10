import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import s from './AdminPage.scss';
import withStyles from '../../decorators/withStyles';
import Box from '../Box';
import { transfer, restart, name } from '../../actions';
import store from '../../stores';
import getPlayerById from '../../utils/getPlayerById';
import Button from '../Button';
import Loader from '../Loader';

const title = 'Admin';

const cx = classNames.bind(s);

@withStyles(s)
class ClientPage extends Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  state = {
    restarting: false,
    round: 0,
    player1: { id: 'player1' },
    player2: { id: 'player2' }
  };

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
    }.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidUpdate(prevProps, prevState) {
    const { player1, player2 } = this.state;
    const prevRoundPlayer = prevState.roundPlayer;
    const currentRoundPlayer = this.state.roundPlayer;
    if (prevRoundPlayer !== currentRoundPlayer) {
      if (currentRoundPlayer === player1.id) {
        this.refs.player1.refs.component.focus();
      } else if (currentRoundPlayer === player2.id) {
        this.refs.player2.refs.component.focus();
      }
    }
  }

  handlePlayer1Transfer(id, amount) {
    const { player1, player2 } = this.state;
    store.dispatch(transfer(player1.id, player2.id, amount));
  }

  handlePlayer2Transfer(id, amount) {
    const { player1, player2 } = this.state;
    store.dispatch(transfer(player2.id, player1.id, amount));
  }

  handleNameChanged(id, newName) {
    store.dispatch(name(id, newName));
  }

  newGame() {
    store.dispatch(restart());
  }

  render() {
    const { player1, player2, round, roundPlayer, restarting } = this.state;
    const isPlayer1Round = roundPlayer === player1.id;
    return (
      <div className={s.container}>
        <div className={s.mainContainer}>
          <div className={cx(s.player1Container, { active: isPlayer1Round })}>
            <h1 className={cx(s.turnHeading, { active: isPlayer1Round })}>Your turn!</h1>
            <Box ref="player1" {...player1} onTransfer={this.handlePlayer1Transfer.bind(this)} />
            <div className={s.playerOverlay}></div>
          </div>
          <div className={cx(s.player2Container, { active: !isPlayer1Round })}>
            <h1 className={cx(s.turnHeading, { active: !isPlayer1Round })}>Your turn!</h1>
            <Box ref="player2" {...player2} isClient={true}
              onNameChanged={this.handleNameChanged.bind(this)} onTransfer={this.handlePlayer2Transfer.bind(this)} />
            <div className={s.playerOverlay}></div>
          </div>
        </div>
        <div className={s.controlPanel}>
          <h2 className={s.round}>{'Round: ' + round}</h2>
          <Button className={s.button} onClick={this.newGame.bind(this)}>Start a new game</Button>
        </div>
        <div className={cx(s.overlay, { active: restarting })}>
          <Loader />
        </div>
      </div>
    );
  }
}

export default ClientPage;
