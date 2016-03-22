import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import s from './AdminPage.scss';
import withStyles from '../../decorators/withStyles';
import Box from '../Box';
import { transfer, restart, name, save, reset } from '../../actions';
import store from '../../stores';
import getPlayerById from '../../utils/getPlayerById';
import pick from '../../utils/pick';
import isNewGame from '../../utils/isNewGame';
import Button from '../Button';
import TextBox from '../TextBox';
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
    saving: false,
    resetting: false,
    game: 0,
    round: 0,
    player1: { id: 'player1' },
    player2: { id: 'player2' },
    condition: 0,
    gender: 0,
    number: 0,
    comment: null,
    detailsOpened: false,
    resetOpened: false
  };

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      delete state.detailsOpened; // WORKAROUND
      if (this.state.saving && !state.saving) {
        state.detailsOpened = false;
      }
      if (this.state.resetting && !state.resetting) {
        state.resetOpened = false;
      }
      if (isNewGame(state, this.state)) {
        state.detailsOpened = true;
      }
      this.setState(state);
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

  handleConditionChanged(e) {
    this.setState({ condition: +e.target.value });
  }

  handleGenderChanged(e) {
    this.setState({ gender: +e.target.value });
  }

  handleNumberChanged(e) {
    this.setState({ number: e.target.value });
  }

  handleCommentChange(e) {
    this.setState({ comment: e.target.value });
  }

  newGame() {
    store.dispatch(restart());
  }

  openDialog() {
    this.setState({ detailsOpened: true });
  }

  closeDialog() {
    this.setState({ detailsOpened: false });
  }

  openResetDialog() {
    this.setState({ resetOpened: true });
  }

  closeResetDialog() {
    this.setState({ resetOpened: false });
  }

  save() {
    const payload = pick(this.state, 'number', 'condition', 'gender', 'comment');
    store.dispatch(save(payload));
  }

  download() {
    window.open('/download', 'download');
  }

  reset() {
    store.dispatch(reset());
  }

  render() {
    const { player1, player2, round, roundPlayer, saving,
      restarting, startedTime, endedTime, detailsOpened,
      number, condition, gender, comment, resetting, resetOpened } = this.state;
    const isPlayer1Round = roundPlayer === player1.id;
    const dateString = (new Date(startedTime)).toLocaleDateString('en', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

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
          <h2 className={s.round}>{'Number: ' + number}</h2>
          <h2 className={s.round}>{'Round: ' + round}</h2>
          <Button className={s.button} onClick={this.openDialog.bind(this)}>Edit game details</Button>
          <Button className={s.button} onClick={this.download.bind(this)}>Download log</Button>
          <Button className={s.button} onClick={this.openResetDialog.bind(this)}>Clear log</Button>
          <Button className={s.button} onClick={this.newGame.bind(this)}>
            { restarting ? <Loader /> : <span>New game</span> }
          </Button>
        </div>
        <div className={cx(s.overlay, { active: restarting })}>
          <Loader />
        </div>
        {/* TODO: Dialog.js */}
        <div className={cx(s.overlay, { active: !!endedTime })}>
          <div className={s.dialog}>
            <h1>Game Over!</h1>
            <Button className={s.button} onClick={this.newGame.bind(this)}>
              { restarting ? <Loader /> : <span>New game</span> }
            </Button>
          </div>
        </div>
        <div className={cx(s.overlay, { active: resetOpened })}>
          <div className={s.dialog}>
            <h1>Are you sure?</h1>
            <div className={s.formMember}>
              <Button className={s.formButton} type="button" disabled={saving} onClick={this.reset.bind(this)}>
                { resetting ? <Loader /> : <span>Yes</span> }
              </Button>
              <Button className={s.formButton} type="button" onClick={this.closeResetDialog.bind(this)}>No</Button>
            </div>
          </div>
        </div>
        <div className={cx(s.overlay, { active: detailsOpened })}>
          {/* TODO: Component */}
          <form className={s.dialog}>
            <h1>Game Details</h1>
            <div className={s.formMember}>
              <label className={s.block}>Date and time</label>
              <div>{ dateString }</div>
            </div>
            <div className={s.formMember}>
              <label className={s.block}>Trial number</label>
              <TextBox onChange={this.handleNumberChanged.bind(this)} value={number}></TextBox>
            </div>
            <div className={s.formMember}>
              <label className={s.block}>Condition</label>
              <label><input type="radio" name="condition" value={1}
                onChange={this.handleConditionChanged.bind(this)} checked={condition === 1} /><span>1</span></label>
              <label><input type="radio" name="condition" value={2}
                onChange={this.handleConditionChanged.bind(this)} checked={condition === 2} /><span>2</span></label>
              <label><input type="radio" name="condition" value={3}
                onChange={this.handleConditionChanged.bind(this)} checked={condition === 3} /><span>3</span></label>
              <label><input type="radio" name="condition" value={4}
                onChange={this.handleConditionChanged.bind(this)} checked={condition === 4} /><span>4</span></label>
            </div>
            <div className={s.formMember}>
              <label className={s.block}>Gender</label>
              <label><input type="radio" name="gender" value={1}
                onChange={this.handleGenderChanged.bind(this)} checked={gender === 1} /><span>Male</span></label>
              <label><input type="radio" name="gender" value={2}
                onChange={this.handleGenderChanged.bind(this)} checked={gender === 2} /><span>Female</span></label>
            </div>
            <div className={s.formMember}>
              <label className={s.block}>Comment</label>
              <TextBox maxLines={2} onChange={this.handleCommentChange.bind(this)} value={comment}></TextBox>
            </div>
            <div className={s.formMember}>
              <Button className={s.formButton} type="button" disabled={saving} onClick={this.save.bind(this)}>
                { saving ? <Loader /> : <span>Save</span> }
              </Button>
              <Button className={s.formButton} type="button" onClick={this.closeDialog.bind(this)}>Close</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ClientPage;
