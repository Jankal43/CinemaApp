import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Movie from '@/models/Movie';

/**
 * GET /api/movies/[id]
 * Returns a specific movie by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const movie = await Movie.findById(id);
    
    if (!movie) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Movie not found' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: movie
    });
    
  } catch (error) {
    console.error('Error fetching movie:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch movie',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/movies/[id]
 * Updates a movie
 * Body: same as POST /api/movies
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      posterUrl,
      trailerUrl,
      audioStereoUrl,
      duration,
      genre,
      rating,
      releaseDate
    } = body;
    
    const movie = await Movie.findById(id);
    
    if (!movie) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Movie not found' 
        },
        { status: 404 }
      );
    }
    
    // Update movie fields
    if (title) movie.title = title;
    if (description) movie.description = description;
    if (posterUrl) movie.posterUrl = posterUrl;
    if (trailerUrl) movie.trailerUrl = trailerUrl;
    if (audioStereoUrl) movie.audioStereoUrl = audioStereoUrl;
    if (duration !== undefined) movie.duration = duration;
    if (genre) movie.genre = genre;
    if (rating) movie.rating = rating;
    if (releaseDate) movie.releaseDate = new Date(releaseDate);
    
    await movie.save();
    
    return NextResponse.json({
      success: true,
      data: movie
    });
    
  } catch (error) {
    console.error('Error updating movie:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update movie',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/movies/[id]
 * Deletes a movie
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const movie = await Movie.findByIdAndDelete(id);
    
    if (!movie) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Movie not found' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Movie deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete movie',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
