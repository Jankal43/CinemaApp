import mongoose, { Document, Schema } from 'mongoose';

/**
 * Reservation interface defining the structure of a seat reservation
 */
export interface IReservation extends Document {
  id: string;
  seatId: string;
  movieId: string;
  userId: string;
  timestamp: Date;
  status: 'active' | 'cancelled' | 'expired';
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Reservation schema for MongoDB
 * Represents seat reservations in the cinema
 */
const ReservationSchema = new Schema<IReservation>({
  seatId: {
    type: String,
    required: true,
    ref: 'Seat'
  },
  movieId: {
    type: String,
    required: true,
    ref: 'Movie'
  },
  userId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active',
    required: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Reservation expires in 15 minutes
      return new Date(Date.now() + 15 * 60 * 1000);
    }
  }
}, {
  timestamps: true
});

// Create compound index for efficient queries
ReservationSchema.index({ seatId: 1, movieId: 1 });
ReservationSchema.index({ userId: 1 });
ReservationSchema.index({ status: 1 });
ReservationSchema.index({ expiresAt: 1 });

// Create TTL index to automatically remove expired reservations
ReservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema);
