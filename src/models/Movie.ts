import mongoose, { Document, Schema } from 'mongoose';

/**
 * Movie interface defining the structure of a cinema movie
 */
export interface IMovie extends Document {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  trailerUrl: string;
  audioStereoUrl: string;
  duration?: number; // in minutes
  genre?: string[];
  rating?: string;
  releaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Movie schema for MongoDB
 * Represents movies available in the cinema
 */
const MovieSchema = new Schema<IMovie>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  posterUrl: {
    type: String,
    required: true,
    trim: true
  },
  trailerUrl: {
    type: String,
    required: true,
    trim: true
  },
  audioStereoUrl: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    min: 1,
    max: 300 // max 5 hours
  },
  genre: [{
    type: String,
    trim: true
  }],
  rating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
    default: 'PG'
  },
  releaseDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Create index for title for faster searches
MovieSchema.index({ title: 'text', description: 'text' });

// Create index for genre
MovieSchema.index({ genre: 1 });

export default mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);
