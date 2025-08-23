import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  startedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Note = mongoose.model('Note', noteSchema);

export default Note;
