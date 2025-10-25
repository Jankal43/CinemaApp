import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Seat from '@/models/Seat';

/**
 * GET /api/seats
 * Returns all seats in the cinema
 * Query parameters:
 * - status: filter by seat status ('free' | 'taken')
 * - row: filter by row number
 * - column: filter by column number
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const row = searchParams.get('row');
    const column = searchParams.get('column');
    
    // Build filter object
    const filter: any = {};
    if (status && ['free', 'taken'].includes(status)) {
      filter.status = status;
    }
    if (row) {
      filter.row = parseInt(row);
    }
    if (column) {
      filter.column = parseInt(column);
    }
    
    const seats = await Seat.find(filter).sort({ row: 1, column: 1 });
    
    return NextResponse.json({
      success: true,
      count: seats.length,
      data: seats
    });
    
  } catch (error) {
    console.error('Error fetching seats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch seats',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/seats
 * Creates a new seat (for admin use)
 * Body: { row: number, column: number, status?: 'free' | 'taken', userId?: string }
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { row, column, status = 'free', userId } = body;
    
    // Validate required fields
    if (!row || !column) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Row and column are required' 
        },
        { status: 400 }
      );
    }
    
    // Check if seat already exists
    const existingSeat = await Seat.findOne({ row, column });
    if (existingSeat) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Seat already exists at this position' 
        },
        { status: 409 }
      );
    }
    
    const seat = new Seat({
      row,
      column,
      status,
      userId: status === 'taken' ? userId : undefined
    });
    
    await seat.save();
    
    return NextResponse.json({
      success: true,
      data: seat
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating seat:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create seat',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
