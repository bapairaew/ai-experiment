import {
  LOGIN_COMPTETED,
  NAME_COMPLETED,
  TRANSFER_COMPLETED,
  RESTART_COMPLETED
} from '../constants/ActionTypes';

import {
  loginCompleted, transferCompleted, nameCompleted, restartCompleted
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

  socket.on(RESTART_COMPLETED, (game) => {
    dispatch(restartCompleted(game));
  });
}

export default socket;
