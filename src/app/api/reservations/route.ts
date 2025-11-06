import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Reservation from '@/models/Reservation';
import Seat from '@/models/Seat';
import Movie from '@/models/Movie';

/**
 * GET /api/reservations
 * Returns all reservations
 * Query parameters:
 * - userId: filter by user ID
 * - movieId: filter by movie ID
 * - status: filter by reservation status
 * - limit: limit number of results
 * - page: page number for pagination
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const movieId = searchParams.get('movieId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build filter object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (userId) filter.userId = userId;
    if (movieId) filter.movieId = movieId;
    if (status && ['active', 'cancelled', 'expired'].includes(status)) {
      filter.status = status;
    }
    
    const reservations = await Reservation.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('seatId', 'row column status')
      .populate('movieId', 'title posterUrl');
    
    const total = await Reservation.countDocuments(filter);
    
    return NextResponse.json({
      success: true,
      count: reservations.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: reservations
    });
    
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch reservations',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reservations
 * Creates a new reservation
 * Body: { seatId: string, movieId: string, userId: string }
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { seatId, movieId, userId } = body;
    
    // Validate required fields
    if (!seatId || !movieId || !userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'SeatId, movieId, and userId are required' 
        },
        { status: 400 }
      );
    }
    
    // Check if seat exists and is available
    const seat = await Seat.findById(seatId);
    if (!seat) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Seat not found' 
        },
        { status: 404 }
      );
    }
    
    if (seat.status === 'taken') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Seat is already taken' 
        },
        { status: 409 }
      );
    }
    
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Movie not found' 
        },
        { status: 404 }
      );
    }
    
    // Check if user already has a reservation for this seat
    const existingReservation = await Reservation.findOne({
      seatId,
      userId,
      status: 'active'
    });
    
    if (existingReservation) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User already has an active reservation for this seat' 
        },
        { status: 409 }
      );
    }
    
    // Create reservation
    const reservation = new Reservation({
      seatId,
      movieId,
      userId,
      timestamp: new Date()
    });
    
    await reservation.save();
    
    // Update seat status
    seat.status = 'taken';
    seat.userId = userId;
    await seat.save();
    
    // Populate the reservation with seat and movie data
    await reservation.populate('seatId', 'row column status');
    await reservation.populate('movieId', 'title posterUrl');
    
    return NextResponse.json({
      success: true,
      data: reservation
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create reservation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
