import mongoose from 'mongoose';

const { Schema } = mongoose;

const GameSchema = new Schema({
  player1: Schema.Types.Mixed,
  player2: Schema.Types.Mixed,
  log: [Schema.Types.Mixed],
  startedTime: Date,
  endedTime: Date,
  number: String,
  condition: Number,
  gender: Number,
  comment: String
});

GameSchema.methods = {
  round: function () {
    return this.log.length + 1;
  }
};

export default mongoose.model('Game', GameSchema);
