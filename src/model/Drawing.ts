import mongoose, { Schema, Document } from 'mongoose';

// Interface for TypeScript
export interface IDrawing extends Document {
  name: string;
  imageData: string; // Base64 encoded image data
  timestamp: Date;
}

// MongoDB Schema
const DrawingSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [1, 'Name must be at least 1 character'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  imageData: {
    type: String,
    required: [true, 'Image data is required']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance on timestamp
DrawingSchema.index({ timestamp: -1 });

export default mongoose.models.Drawing || mongoose.model<IDrawing>('Drawing', DrawingSchema);
