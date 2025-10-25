import connectDB from './db';
import Seat from '@/models/Seat';
import Movie from '@/models/Movie';

/**
 * Seed script to populate the database with initial data
 * Run with: npm run seed
 */

const seedSeats = async () => {
  console.log('Seeding seats...');
  
  // Create a 10x15 cinema hall (150 seats total)
  const seats = [];
  for (let row = 1; row <= 10; row++) {
    for (let column = 1; column <= 15; column++) {
      seats.push({
        row,
        column,
        status: 'free'
      });
    }
  }
  
  // Clear existing seats
  await Seat.deleteMany({});
  
  // Insert new seats
  await Seat.insertMany(seats);
  
  console.log(`Created ${seats.length} seats`);
};

const seedMovies = async () => {
  console.log('Seeding movies...');
  
  const movies = [
    {
      title: 'Inception',
      description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      posterUrl: '/posters/inception.jpg',
      trailerUrl: '/trailers/inception.mp4',
      audioStereoUrl: '/audio/inception-stereo.wav',
      duration: 148,
      genre: ['Action', 'Sci-Fi', 'Thriller'],
      rating: 'PG-13',
      releaseDate: new Date('2010-07-16')
    },
    {
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      posterUrl: '/posters/interstellar.jpg',
      trailerUrl: '/trailers/interstellar.mp4',
      audioStereoUrl: '/audio/interstellar-stereo.wav',
      duration: 169,
      genre: ['Adventure', 'Drama', 'Sci-Fi'],
      rating: 'PG-13',
      releaseDate: new Date('2014-11-07')
    },
    {
      title: 'The Dark Knight',
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      posterUrl: '/posters/dark-knight.jpg',
      trailerUrl: '/trailers/dark-knight.mp4',
      audioStereoUrl: '/audio/dark-knight-stereo.wav',
      duration: 152,
      genre: ['Action', 'Crime', 'Drama'],
      rating: 'PG-13',
      releaseDate: new Date('2008-07-18')
    },
    {
      title: 'Avatar',
      description: 'A paraplegic marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
      posterUrl: '/posters/avatar.jpg',
      trailerUrl: '/trailers/avatar.mp4',
      audioStereoUrl: '/audio/avatar-stereo.wav',
      duration: 162,
      genre: ['Action', 'Adventure', 'Fantasy'],
      rating: 'PG-13',
      releaseDate: new Date('2009-12-18')
    },
    {
      title: 'Dune',
      description: 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.',
      posterUrl: '/posters/dune.jpg',
      trailerUrl: '/trailers/dune.mp4',
      audioStereoUrl: '/audio/dune-stereo.wav',
      duration: 155,
      genre: ['Adventure', 'Drama', 'Sci-Fi'],
      rating: 'PG-13',
      releaseDate: new Date('2021-10-22')
    }
  ];
  
  // Clear existing movies
  await Movie.deleteMany({});
  
  // Insert new movies
  await Movie.insertMany(movies);
  
  console.log(`Created ${movies.length} movies`);
};

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    await connectDB();
    
    await seedSeats();
    await seedMovies();
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
