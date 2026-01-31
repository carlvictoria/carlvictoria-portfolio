import mongoose, { Schema, Document } from 'mongoose';

// Interface for TypeScript
export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'general' | 'commission' | 'collaboration' | 'job';
  status: 'unread' | 'read' | 'replied';
  createdAt: Date;
}

// MongoDB Schema
const ContactSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  type: {
    type: String,
    enum: ['general', 'commission', 'collaboration', 'job'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied'],
    default: 'unread'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ status: 1 });

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);