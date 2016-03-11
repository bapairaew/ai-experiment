import {
  LOGIN_COMPTETED,
  NAME_COMPLETED,
  SAVE_COMPLETED,
  RESET_COMPLETED,
  TRANSFER_COMPLETED,
  RESTART_COMPLETED
} from '../constants/ActionTypes';

import {
  loginCompleted, transferCompleted, nameCompleted, saveCompleted, resetCompleted, restartCompleted
} from '../actions';

import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import store from '../stores';

const dispatch = store.dispatch;

let socket;

if (canUseDOM) {
  socket = io();
  socket.on(LOGIN_COMPTETED, (game) => {
    dispatch(loginCompleted(game));
  });

  socket.on(TRANSFER_COMPLETED, (game) => {
    dispatch(transferCompleted(game));
  });

  socket.on(NAME_COMPLETED, (id, name) => {
    dispatch(nameCompleted(id, name));
  });

  socket.on(SAVE_COMPLETED, (payload) => {
    dispatch(saveCompleted(payload));
  });

  socket.on(RESET_COMPLETED, (payload) => {
    dispatch(resetCompleted(payload));
  });

  socket.on(RESTART_COMPLETED, (game) => {
    dispatch(restartCompleted(game));
  });
}

export default socket;
