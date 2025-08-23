import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: 'user'
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'others'],
    default: null
  },
  educationStatus: {
    type: String,
    enum: ['school', 'college'],
    default: null
  },
  explanationStyle: {
    type: String,
    enum: ['simple', 'detailed', 'fast_paced'],
    default: null
  },
  comfortLanguage: {
    type: String,
    enum: ['english', 'hindi', 'gujrati', 'bengali', 'others'],
    default: null
  }
}, {
  timestamps: true
});

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

export default UserPreference;
