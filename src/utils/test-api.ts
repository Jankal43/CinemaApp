/**
 * Simple API test script
 * Run with: npm run test:api
 */

import connectDB from './db';
import Seat from '@/models/Seat';
import Movie from '@/models/Movie';
import Reservation from '@/models/Reservation';

const testDatabase = async () => {
  try {
    console.log('Testing database connection...');
    await connectDB();
    console.log('✅ Database connected successfully');

    // Test seat operations
    console.log('\nTesting seat operations...');
    const seats = await Seat.find().limit(5);
    console.log(`✅ Found ${seats.length} seats`);

    // Test movie operations
    console.log('\nTesting movie operations...');
    const movies = await Movie.find().limit(3);
    console.log(`✅ Found ${movies.length} movies`);
    if (movies.length > 0) {
      console.log(`   Sample movie: ${movies[0].title}`);
    }

    // Test reservation operations
    console.log('\nTesting reservation operations...');
    const reservations = await Reservation.find().limit(3);
    console.log(`✅ Found ${reservations.length} reservations`);

    // Test creating a test reservation
    if (seats.length > 0 && movies.length > 0) {
      console.log('\nTesting reservation creation...');
      
      // Find a free seat
      const freeSeat = await Seat.findOne({ status: 'free' });
      if (freeSeat) {
        const testReservation = new Reservation({
          seatId: freeSeat._id.toString(),
          movieId: movies[0]._id.toString(),
          userId: 'test-user-123',
          timestamp: new Date()
        });
        
        await testReservation.save();
        console.log('✅ Test reservation created successfully');
        
        // Clean up test reservation
        await Reservation.findByIdAndDelete(testReservation._id);
        console.log('✅ Test reservation cleaned up');
      }
    }

    console.log('\n🎉 All tests passed! Backend is ready to use.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

// Run the test if this file is executed directly
if (require.main === module) {
  testDatabase();
}

export default testDatabase;
