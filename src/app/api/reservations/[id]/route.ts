import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Reservation from '@/models/Reservation';
import Seat from '@/models/Seat';

/**
 * GET /api/reservations/[id]
 * Returns a specific reservation by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const reservation = await Reservation.findById(id)
      .populate('seatId', 'row column status')
      .populate('movieId', 'title posterUrl trailerUrl audioStereoUrl');
    
    if (!reservation) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Reservation not found' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: reservation
    });
    
  } catch (error) {
    console.error('Error fetching reservation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch reservation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reservations/[id]
 * Cancels a reservation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const reservation = await Reservation.findById(id);
    
    if (!reservation) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Reservation not found' 
        },
        { status: 404 }
      );
    }
    
    if (reservation.status === 'cancelled') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Reservation is already cancelled' 
        },
        { status: 400 }
      );
    }
    
    // Update reservation status
    reservation.status = 'cancelled';
    await reservation.save();
    
    // Update seat status back to free
    const seat = await Seat.findById(reservation.seatId);
    if (seat) {
      seat.status = 'free';
      seat.userId = undefined;
      await seat.save();
    }
    
    return NextResponse.json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: reservation
    });
    
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to cancel reservation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
