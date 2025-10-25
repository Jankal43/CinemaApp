# Cinema App Backend Setup Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB instance)
- Git

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# MongoDB Connection (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cinema-app?retryWrites=true&w=majority

# TheMovieDB API (Optional - for external movie data)
API_KEY=your_themoviedb_api_key_here

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 3. Database Setup
```bash
# Seed the database with initial data
npm run seed
```

### 4. Test the Backend
```bash
# Test database connection and basic operations
npm run test:api
```

### 5. Start Development Server
```bash
npm run dev
```

## API Endpoints Overview

### Seats Management
- `GET /api/seats` - Get all seats
- `POST /api/seats` - Create new seat
- `GET /api/seats/[id]` - Get specific seat
- `PATCH /api/seats/[id]` - Update seat status
- `DELETE /api/seats/[id]` - Delete seat

### Movies Management
- `GET /api/movies` - Get all movies
- `POST /api/movies` - Create new movie
- `GET /api/movies/[id]` - Get specific movie
- `PUT /api/movies/[id]` - Update movie
- `DELETE /api/movies/[id]` - Delete movie

### Reservations Management
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create new reservation
- `GET /api/reservations/[id]` - Get specific reservation
- `DELETE /api/reservations/[id]` - Cancel reservation

## File Structure

```
src/
├── app/
│   └── api/
│       ├── seats/
│       │   ├── route.ts          # GET, POST /api/seats
│       │   └── [id]/
│       │       └── route.ts      # GET, PATCH, DELETE /api/seats/[id]
│       ├── movies/
│       │   ├── route.ts          # GET, POST /api/movies
│       │   └── [id]/
│       │       └── route.ts      # GET, PUT, DELETE /api/movies/[id]
│       └── reservations/
│           ├── route.ts          # GET, POST /api/reservations
│           └── [id]/
│               └── route.ts      # GET, DELETE /api/reservations/[id]
├── models/
│   ├── Seat.ts                   # Seat model
│   ├── Movie.ts                  # Movie model
│   └── Reservation.ts            # Reservation model
└── utils/
    ├── db.ts                     # Database connection
    ├── seed.ts                   # Database seeding
    └── test-api.ts               # API testing
```

## Database Schema

### Seats (150 seats total - 10 rows × 15 columns)
```typescript
{
  row: number;           // 1-10
  column: number;         // 1-15
  status: 'free' | 'taken';
  userId?: string;
}
```

### Movies (5 sample movies)
```typescript
{
  title: string;
  description: string;
  posterUrl: string;      // Local path
  trailerUrl: string;      // Local path
  audioStereoUrl: string; // Local path
  duration?: number;
  genre?: string[];
  rating?: string;
  releaseDate?: Date;
}
```

### Reservations
```typescript
{
  seatId: string;         // Reference to Seat
  movieId: string;        // Reference to Movie
  userId: string;
  timestamp: Date;
  status: 'active' | 'cancelled' | 'expired';
  expiresAt?: Date;       // Auto-expires in 15 minutes
}
```

## Integration with 3D Frontend

### 1. Fetch Cinema Layout
```javascript
const response = await fetch('/api/seats');
const { data: seats } = await response.json();
// Use seats data to render 3D cinema layout
```

### 2. Load Movies
```javascript
const response = await fetch('/api/movies');
const { data: movies } = await response.json();
// Use movies data for movie selection and trailers
```

### 3. Handle Seat Selection
```javascript
// Reserve a seat
const response = await fetch('/api/reservations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    seatId: 'seat123',
    movieId: 'movie456',
    userId: 'user789'
  })
});
```

### 4. Cancel Reservation
```javascript
// Cancel a reservation
await fetch(`/api/reservations/${reservationId}`, {
  method: 'DELETE'
});
```

## Production Considerations

### Security
- Add authentication middleware
- Implement rate limiting
- Validate all inputs
- Use HTTPS in production

### Performance
- Add database indexes
- Implement caching
- Use connection pooling
- Monitor query performance

### Monitoring
- Add logging
- Set up error tracking
- Monitor API response times
- Track database performance

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MONGODB_URI format
   - Verify network access in MongoDB Atlas
   - Ensure database name is correct

2. **Seed Script Fails**
   - Check database connection
   - Verify model schemas
   - Check for duplicate data

3. **API Routes Not Working**
   - Check Next.js version compatibility
   - Verify file structure
   - Check for TypeScript errors

### Debug Commands
```bash
# Check for linting errors
npm run lint

# Test database connection
npm run test:api

# Reset database
npm run seed
```

## Next Steps

1. **Frontend Integration**: Connect your React Three Fiber 3D scene with these APIs
2. **Authentication**: Add user authentication system
3. **Real-time Updates**: Implement WebSocket for live seat updates
4. **Payment Integration**: Add payment processing for reservations
5. **Admin Panel**: Create admin interface for managing movies and seats

## Support

For issues or questions:
1. Check the API documentation in `API_DOCUMENTATION.md`
2. Review the error logs in the console
3. Test individual endpoints with tools like Postman
4. Verify database connection and data integrity
