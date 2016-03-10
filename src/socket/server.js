import {
  LOGIN_STARTED, LOGIN_COMPTETED,
  NAME_STARTED, NAME_COMPLETED,
  TRANSFER_STARTED, TRANSFER_COMPLETED,
  RESTART_STARTED, RESTART_COMPLETED
} from '../constants/ActionTypes';
import SocketIO from 'socket.io';
import pick from '../utils/pick';
import getPlayerById from '../utils/getPlayerById';

let cache = [];
let io;

const getNewGame = () => {
  return {
    round: 1,
    log: [],
    player1: { id: 'robot', name: 'Agent', player: 1, money: 10 },
    player2: { id: 'client', name: 'Participant', player: 2, money: 10 }
  }
};

const roundDefiner = (game) => game.round % 2 === 0 ? game.player1.id : game.player2.id;
const getPublicGameProperties = (game) => Object.assign(pick(game, 'round', 'player1', 'player2'), { roundPlayer: roundDefiner(game) });

// TODO:
let currentGame = getNewGame();

// TODO:
const getGame = (id) => currentGame;

const emitTransferCompleted = (socket, game) => {
  game = getPublicGameProperties(game);
  socket.emit(TRANSFER_COMPLETED, game);
  socket.broadcast.emit(TRANSFER_COMPLETED, game);
};

const emitNameCompleted = (socket, player) => {
  const { id, name } = player;
  socket.emit(NAME_COMPLETED, id, name);
  socket.broadcast.emit(NAME_COMPLETED, id, name);
};

const emitRestartedCompleted = (socket, game) => {
  game = getPublicGameProperties(game);
  socket.emit(RESTART_COMPLETED, game);
  socket.broadcast.emit(RESTART_COMPLETED, game);
};

const transfer = (socket, from, to, amount) => {
  const currentGame = getGame();
  currentGame.round++;
  const fromPlayer = getPlayerById(currentGame, from);
  const toPlayer = getPlayerById(currentGame, to);
  fromPlayer.money -= amount;
  toPlayer.money += (3 * amount);
  currentGame.log.push({ round: currentGame.round, from, to, amount });
  emitTransferCompleted(socket, currentGame);
};

const changeName = (socket, id, name) => {
  const currentGame = getGame();
  const player = getPlayerById(currentGame, id);
  player.name = name;
  setTimeout(() => emitNameCompleted(socket, player), 2000);
};

const restart = (socket) => {
  cache.push(getGame());
  currentGame = getNewGame();
  emitRestartedCompleted(socket, getGame());
};

const initEvents = (socket) => {
  socket.on(TRANSFER_STARTED, (from, to, amount) => transfer(socket, from, to, amount));
  socket.on(NAME_STARTED, (id, name) => changeName(socket, id, name));
  socket.on(RESTART_STARTED, () => restart(socket));
  socket.emit(LOGIN_COMPTETED, getPublicGameProperties(getGame()));
};

const SocketServer = {
  isInited: () => !!io,
  io: io,

  init: function (http) {
    io = SocketIO(http);
    io.on('connection', initEvents);
    return io;
  }
};

export default SocketServer;
