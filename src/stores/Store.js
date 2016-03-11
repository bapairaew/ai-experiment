import { combineReducers } from 'redux';
import {
  LOGIN_STARTED, LOGIN_COMPTETED,
  NAME_STARTED, NAME_COMPLETED,
  SAVE_STARTED, SAVE_COMPLETED,
  RESET_STARTED, RESET_COMPLETED,
  TRANSFER_STARTED, TRANSFER_COMPLETED,
  RESTART_STARTED, RESTART_COMPLETED
} from '../constants/ActionTypes';
import { createStore } from 'redux';
import getPlayerById from '../utils/getPlayerById';

const handleRestart = (state) => {
  state.restarting = true;
  return state;
};

const handleRestartCompleted = (state, action) => {
  state = action.game;
  state.restarting = false;
  return state;
};

const handleName = (state, action) => {
  const { name, id, type } = action;
  const player = getPlayerById(state, id);
  player.name = name;
  player.naming = type === NAME_STARTED;
  return state;
};

const handleTransfer = (state, action) => {
  const player = getPlayerById(state, action.from);
  player.transferring = true;
  return state;
};

const handleSave = (state, action) => {
  state.saving = true;
  return state;
};

const handleSaveCompleted = (state, action) => {
  Object.assign(state, action.payload);
  state.saving = false;
  return state;
};

const handleReset = (state, flag) => {
  state.resetting = flag;
  return state;
};

const sync = (state, action) => {
  state = action.game;
  return state;
};

function client(state, action) {
  switch (action.type) {
    case RESTART_STARTED:
      return handleRestart(state);
    case RESTART_COMPLETED:
      return handleRestartCompleted(state, action);
    case NAME_STARTED:
    case NAME_COMPLETED:
      return handleName(state, action);
    case SAVE_STARTED:
      return handleSave(state, action);
    case SAVE_COMPLETED:
      return handleSaveCompleted(state, action);
    case RESET_STARTED:
    case RESET_COMPLETED:
      return handleReset(state, action.type === RESET_STARTED);
    case TRANSFER_STARTED:
      return handleTransfer(state, action);
    case TRANSFER_COMPLETED:
      // transferring = falase;
    case LOGIN_COMPTETED:
      return sync(state, action);
  }

  return state;
}

export default createStore(client);
