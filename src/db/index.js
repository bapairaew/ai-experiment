import mongoose from 'mongoose';
import Game from './models/Game';

export default {
  init: (uri) => {
    return mongoose.connect(uri);
  }
};
