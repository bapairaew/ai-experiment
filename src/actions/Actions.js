import {
  LOGIN_STARTED, LOGIN_COMPTETED,
  NAME_STARTED, NAME_COMPLETED,
  TRANSFER_STARTED, TRANSFER_COMPLETED,
  RESTART_STARTED, RESTART_COMPLETED
} from '../constants/ActionTypes';

import socket from '../socket/client';

export const login = (password) => {
  return { type: LOGIN_STARTED, password };
}

export const loginCompleted = (game) => {
  return { type: LOGIN_COMPTETED, game };
}

export const transfer = (from, to, amount) => {
  socket.emit(TRANSFER_STARTED, from, to, amount);
  return { type: TRANSFER_STARTED, from, to, amount };
}

export const transferCompleted = (game) => {
  return { type: TRANSFER_COMPLETED, game };
}

export const name = (id, name) => {
  socket.emit(NAME_STARTED, id, name);
  return { type: NAME_STARTED, id, name };
}

export const nameCompleted = (id, name) => {
  return { type: NAME_COMPLETED, id, name };
}

export const restart = () => {
  socket.emit(RESTART_STARTED);
  return { type: RESTART_STARTED };
}

export const restartCompleted = (game) => {
  return { type: RESTART_COMPLETED, game };
}
