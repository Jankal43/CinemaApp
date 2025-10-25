# Cinema App Backend API Documentation

## Overview
This backend provides a complete API for a 3D cinema seat selection system built with Next.js 15.1.2, MongoDB, and Mongoose.

## Database Models

### Seat Model
```typescript
{
  id: string;
  row: number;           // 1-20
  column: number;         // 1-30
  status: 'free' | 'taken';
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Movie Model
```typescript
{
  id: string;
  title: string;
  description: string;
  posterUrl: string;      // Local path to poster image
  trailerUrl: string;     // Local path to trailer video
  audioStereoUrl: string; // Local path to stereo audio
  duration?: number;      // in minutes
  genre?: string[];
  rating?: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  releaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Reservation Model
```typescript
{
  id: string;
  seatId: string;         // Reference to Seat
  movieId: string;        // Reference to Movie
  userId: string;
  timestamp: Date;
  status: 'active' | 'cancelled' | 'expired';
  expiresAt?: Date;       // Auto-expires in 15 minutes
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### Seats API

#### GET /api/seats
Returns all seats with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by status ('free' | 'taken')
- `row` (optional): Filter by row number
- `column` (optional): Filter by column number

**Response:**
```json
{
  "success": true,
  "count": 150,
  "data": [
    {
      "id": "...",
      "row": 1,
      "column": 1,
      "status": "free",
      "userId": null,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### POST /api/seats
Creates a new seat (admin use).

**Body:**
```json
{
  "row": 1,
  "column": 1,
  "status": "free",
  "userId": null
}
```

#### GET /api/seats/[id]
Returns a specific seat by ID.

#### PATCH /api/seats/[id]
Updates a seat's status (for reservations).

**Body:**
```json
{
  "status": "taken",
  "userId": "user123"
}
```

#### DELETE /api/seats/[id]
Deletes a seat (admin use).

### Movies API

#### GET /api/movies
Returns all movies with optional filtering and pagination.

**Query Parameters:**
- `search` (optional): Search in title and description
- `genre` (optional): Filter by genre
- `limit` (optional): Number of results (default: 10)
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "total": 5,
  "page": 1,
  "totalPages": 1,
  "data": [
    {
      "id": "...",
      "title": "Inception",
      "description": "...",
      "posterUrl": "/posters/inception.jpg",
      "trailerUrl": "/trailers/inception.mp4",
      "audioStereoUrl": "/audio/inception-stereo.wav",
      "duration": 148,
      "genre": ["Action", "Sci-Fi", "Thriller"],
      "rating": "PG-13",
      "releaseDate": "2010-07-16T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/movies
Creates a new movie.

**Body:**
```json
{
  "title": "Movie Title",
  "description": "Movie description",
  "posterUrl": "/posters/movie.jpg",
  "trailerUrl": "/trailers/movie.mp4",
  "audioStereoUrl": "/audio/movie-stereo.wav",
  "duration": 120,
  "genre": ["Action", "Drama"],
  "rating": "PG-13",
  "releaseDate": "2024-01-01"
}
```

#### GET /api/movies/[id]
Returns a specific movie by ID.

#### PUT /api/movies/[id]
Updates a movie.

#### DELETE /api/movies/[id]
Deletes a movie.

### Reservations API

#### GET /api/reservations
Returns all reservations with optional filtering.

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `movieId` (optional): Filter by movie ID
- `status` (optional): Filter by status
- `limit` (optional): Number of results (default: 10)
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "totalPages": 1,
  "data": [
    {
      "id": "...",
      "seatId": {
        "id": "...",
        "row": 5,
        "column": 10,
        "status": "taken"
      },
      "movieId": {
        "id": "...",
        "title": "Inception",
        "posterUrl": "/posters/inception.jpg"
      },
      "userId": "user123",
      "timestamp": "2024-01-01T12:00:00.000Z",
      "status": "active",
      "expiresAt": "2024-01-01T12:15:00.000Z"
    }
  ]
}
```

#### POST /api/reservations
Creates a new reservation.

**Body:**
```json
{
  "seatId": "seat123",
  "movieId": "movie456",
  "userId": "user789"
}
```

#### GET /api/reservations/[id]
Returns a specific reservation by ID with populated seat and movie data.

#### DELETE /api/reservations/[id]
Cancels a reservation and frees the seat.

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file with:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cinema-app?retryWrites=true&w=majority
   API_KEY=your_themoviedb_api_key_here
   ```

3. **Seed the database:**
   ```bash
   npm run seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## File Structure

```
src/
├── app/
│   └── api/
│       ├── seats/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       ├── movies/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       └── reservations/
│           ├── route.ts
│           └── [id]/
│               └── route.ts
├── models/
│   ├── Seat.ts
│   ├── Movie.ts
│   └── Reservation.ts
└── utils/
    ├── db.ts
    └── seed.ts
```

## Features

- **MongoDB Integration**: Full CRUD operations with Mongoose
- **Type Safety**: Complete TypeScript support
- **Error Handling**: Comprehensive error responses
- **Validation**: Input validation and business logic
- **Pagination**: Built-in pagination for large datasets
- **Search**: Text search capabilities
- **Auto-expiration**: Reservations auto-expire after 15 minutes
- **Seat Management**: Real-time seat status updates
- **Local Media**: Support for local trailers and audio files

## Integration with 3D Frontend

The API is designed to work seamlessly with your React Three Fiber 3D cinema visualization:

1. **Seat Selection**: Use `/api/seats` to get seat layout and status
2. **Movie Data**: Use `/api/movies` to get movie information and media URLs
3. **Reservations**: Use `/api/reservations` to manage seat bookings
4. **Real-time Updates**: Poll endpoints or implement WebSocket for live updates

## Security Considerations

- Input validation on all endpoints
- MongoDB injection protection via Mongoose
- Rate limiting recommended for production
- Authentication/authorization should be added for production use
- CORS configuration for frontend integration
