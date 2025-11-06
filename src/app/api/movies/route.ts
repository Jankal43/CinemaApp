import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Movie from '@/models/Movie';


export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const genre = searchParams.get('genre');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build filter object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (search) {
      filter.$text = { $search: search };
    }
    if (genre) {
      filter.genre = genre;
    }
    
    const movies = await Movie.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Movie.countDocuments(filter);
    
    return NextResponse.json({
      success: true,
      count: movies.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: movies
    });
    
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch movies',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/movies
 * Creates a new movie
 * Body: {
 *   title: string,
 *   description: string,
 *   posterUrl: string,
 *   trailerUrl: string,
 *   audioStereoUrl: string,
 *   duration?: number,
 *   genre?: string[],
 *   rating?: string,
 *   releaseDate?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
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
    
    // Validate required fields
    if (!title || !description || !posterUrl || !trailerUrl || !audioStereoUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Title, description, posterUrl, trailerUrl, and audioStereoUrl are required' 
        },
        { status: 400 }
      );
    }
    
    // Check if movie with same title already exists
    const existingMovie = await Movie.findOne({ title });
    if (existingMovie) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Movie with this title already exists' 
        },
        { status: 409 }
      );
    }
    
    const movie = new Movie({
      title,
      description,
      posterUrl,
      trailerUrl,
      audioStereoUrl,
      duration,
      genre,
      rating,
      releaseDate: releaseDate ? new Date(releaseDate) : undefined
    });
    
    await movie.save();
    
    return NextResponse.json({
      success: true,
      data: movie
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create movie',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
