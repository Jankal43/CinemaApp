import mongoose, { Document, Schema } from 'mongoose';

/**
 * Seat interface defining the structure of a cinema seat
 */
export interface ISeat extends Document {
  id: string;
  row: number;
  column: number;
  status: 'free' | 'taken';
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Seat schema for MongoDB
 * Represents individual seats in the cinema hall
 */
const SeatSchema = new Schema<ISeat>({
  row: {
    type: Number,
    required: true,
    min: 1,
    max: 20 // Assuming max 20 rows
  },
  column: {
    type: Number,
    required: true,
    min: 1,
    max: 30 // Assuming max 30 columns
  },
  status: {
    type: String,
    enum: ['free', 'taken'],
    default: 'free',
    required: true
  },
  userId: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Create compound index to ensure unique seat positions
SeatSchema.index({ row: 1, column: 1 }, { unique: true });

// Create index for status for faster queries
SeatSchema.index({ status: 1 });

export default mongoose.models.Seat || mongoose.model<ISeat>('Seat', SeatSchema);
