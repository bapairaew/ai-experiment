import {
  LOGIN_STARTED, LOGIN_COMPTETED,
  NAME_STARTED, NAME_COMPLETED,
  SAVE_STARTED, SAVE_COMPLETED,
  RESET_STARTED, RESET_COMPLETED,
  TRANSFER_STARTED, TRANSFER_COMPLETED,
  RESTART_STARTED, RESTART_COMPLETED
} from '../constants/ActionTypes';
import SocketIO from 'socket.io';
import pick from '../utils/pick';
import getPlayerById from '../utils/getPlayerById';

import Game from '../db/models/Game';

let io;
let db;
let index = 0;
Game.count({}, (err, value) => { index = value });

const getNewGame = () => {
  return new Game({
    log: [],
    player1: { id: 'Agent', name: 'Agent', player: 1, money: 10 },
    player2: { id: 'Participant', name: 'Participant', player: 2, money: 10 },
    startedTime: new Date(),
    endedTime: null,
    number: index + 1,
    condition: 1,
    gender: 1,
    comment: null
  });
};

// TODO:
let currentGame = getNewGame();

// TODO:
const getGame = (id) => currentGame;

const GAME_LENGTH = 12;

const roundDefiner = (game) => game.round() % 2 === 0 ? game.player1.id : game.player2.id;
const getPublicGameProperties = (game) => {
  return Object.assign(pick(game, 'player1', 'player2', 'startedTime', 'endedTime', 'number', 'condition', 'gender', 'comment'),
    { roundPlayer: roundDefiner(game), round: game.round() });
};

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

const emitSaveCompleted = (socket, payload) => {
  socket.emit(SAVE_COMPLETED, payload);
  socket.broadcast.emit(SAVE_COMPLETED, payload);
};

const emitResetCompleted = (socket) => {
  socket.emit(RESET_COMPLETED);
  socket.broadcast.emit(RESET_COMPLETED);
};

const transfer = (socket, from, to, amount) => {
  const currentGame = getGame();
  if (currentGame.round() <= GAME_LENGTH) {
    const fromPlayer = getPlayerById(currentGame, from);
    const toPlayer = getPlayerById(currentGame, to);
    fromPlayer.money -= amount;
    toPlayer.money += (3 * amount);
    currentGame.log.push({ round: currentGame.round(), from, to, amount });
  }
  if (currentGame.round() > GAME_LENGTH) {
    currentGame.endedTime = new Date();
  }
  emitTransferCompleted(socket, currentGame);
};

const changeName = (socket, id, name) => {
  const currentGame = getGame();
  const player = getPlayerById(currentGame, id);
  player.name = name;
  emitNameCompleted(socket, player);
};

const restart = (socket) => {
  const game = getGame();
  game.save(  () => {
    currentGame = getNewGame();
    emitRestartedCompleted(socket, getGame());
  });
};

const save = (socket, payload) => {
  const currentGame = getGame();
  Object.assign(currentGame, pick(payload, 'number', 'condition', 'gender', 'comment'));
  emitSaveCompleted(socket, payload);
};

const reset = (socket) => {
  Game.remove({}, function (err) {
    emitResetCompleted(socket);
  });
};

const initEvents = (socket) => {
  socket.on(TRANSFER_STARTED, (from, to, amount) => transfer(socket, from, to, amount));
  socket.on(NAME_STARTED, (id, name) => changeName(socket, id, name));
  socket.on(SAVE_STARTED, (payload) => save(socket, payload));
  socket.on(RESET_STARTED, () => reset(socket));
  socket.on(RESTART_STARTED, () => restart(socket));
  socket.emit(LOGIN_COMPTETED, getPublicGameProperties(getGame()));
};

const parseDownloadContent = (games) => {
  return games.map((game) => {
    return ['DATE: ' + game.startedTime,
      'TRIAL NUMBER: ' + game.number,
      'CONDITION: ' + game.condition,
      'GENDER: ' + game.gender,
      'COMMENT: ' + (game.comment || ''),
      'LOG',
      game.log.map((l) => [l.from, l.to, l.amount].join('\t')).join('<br />')
    ].join('<br />');
  }).join('<br /><br />');
};

const SocketServer = {
  init: (http, _db) => {
    io = SocketIO(http);
    io.on('connection', initEvents);
    db = _db;
    return {
      getDownableContent: (cb) => {
        return Game.find({}, function (err, list) {
          cb(parseDownloadContent(list));
        });
      }
    };
  }
};

export default SocketServer;
