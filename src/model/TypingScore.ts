import mongoose, { Schema, Document } from 'mongoose';

// Interface for TypeScript
export interface ITypingScore extends Document {
  name: string;
  wpm: number;
  accuracy: number;
  score: number; // Calculated score based on WPM and accuracy
  timestamp: Date;
}

// MongoDB Schema
const TypingScoreSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [1, 'Name must be at least 1 character'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  wpm: {
    type: Number,
    required: [true, 'WPM is required'],
    min: [0, 'WPM cannot be negative'],
    max: [500, 'WPM cannot exceed 500']
  },
  accuracy: {
    type: Number,
    required: [true, 'Accuracy is required'],
    min: [0, 'Accuracy cannot be negative'],
    max: [100, 'Accuracy cannot exceed 100%']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be negative']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance on scores
TypingScoreSchema.index({ score: -1 });

export default mongoose.models.TypingScore || mongoose.model<ITypingScore>('TypingScore', TypingScoreSchema);