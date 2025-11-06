import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Seat from '@/models/Seat';

/**
 * GET /api/seats/[id]
 * Returns a specific seat by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const seat = await Seat.findById(id);
    
    if (!seat) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Seat not found' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: seat
    });
    
  } catch (error) {
    console.error('Error fetching seat:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch seat',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/seats/[id]
 * Updates a seat's status (for reservations)
 * Body: { status: 'free' | 'taken', userId?: string }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    const { status, userId } = body;
    
    // Validate status
    if (!status || !['free', 'taken'].includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Status must be either "free" or "taken"' 
        },
        { status: 400 }
      );
    }
    
    const seat = await Seat.findById(id);
    
    if (!seat) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Seat not found' 
        },
        { status: 404 }
      );
    }
    
    // Update seat
    seat.status = status;
    seat.userId = status === 'taken' ? userId : undefined;
    
    await seat.save();
    
    return NextResponse.json({
      success: true,
      data: seat
    });
    
  } catch (error) {
    console.error('Error updating seat:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update seat',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/seats/[id]
 * Deletes a seat (for admin use)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const seat = await Seat.findByIdAndDelete(id);
    
    if (!seat) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Seat not found' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Seat deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting seat:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete seat',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
