/**
 * Cinema API client utilities
 * Helper functions for integrating with the 3D cinema scene
 */

export interface SeatData {
  id: string;
  row: number;
  column: number;
  status: 'free' | 'taken';
  userId?: string;
}

export interface MovieData {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  trailerUrl: string;
  audioStereoUrl: string;
  duration?: number;
  genre?: string[];
  rating?: string;
}

export interface ReservationData {
  id: string;
  seatId: string;
  movieId: string;
  userId: string;
  timestamp: string;
  status: 'active' | 'cancelled' | 'expired';
  expiresAt?: string;
}

/**
 * API client class for cinema operations
 */
export class CinemaAPI {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch all seats with optional filtering
   */
  async getSeats(filters?: {
    status?: 'free' | 'taken';
    row?: number;
    column?: number;
  }): Promise<SeatData[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.row) params.append('row', filters.row.toString());
    if (filters?.column) params.append('column', filters.column.toString());

    const response = await fetch(`${this.baseUrl}/api/seats?${params}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch seats');
    }
    
    return data.data;
  }

  /**
   * Fetch all movies with optional filtering
   */
  async getMovies(filters?: {
    search?: string;
    genre?: string;
    limit?: number;
    page?: number;
  }): Promise<MovieData[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.genre) params.append('genre', filters.genre);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const response = await fetch(`${this.baseUrl}/api/movies?${params}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch movies');
    }
    
    return data.data;
  }

  /**
   * Fetch a specific movie by ID
   */
  async getMovie(movieId: string): Promise<MovieData> {
    const response = await fetch(`${this.baseUrl}/api/movies/${movieId}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch movie');
    }
    
    return data.data;
  }

  /**
   * Create a new reservation
   */
  async createReservation(
    seatId: string,
    movieId: string,
    userId: string
  ): Promise<ReservationData> {
    const response = await fetch(`${this.baseUrl}/api/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        seatId,
        movieId,
        userId,
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create reservation');
    }
    
    return data.data;
  }

  /**
   * Cancel a reservation
   */
  async cancelReservation(reservationId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/reservations/${reservationId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to cancel reservation');
    }
  }

  /**
   * Update seat status (for real-time updates)
   */
  async updateSeatStatus(
    seatId: string,
    status: 'free' | 'taken',
    userId?: string
  ): Promise<SeatData> {
    const response = await fetch(`${this.baseUrl}/api/seats/${seatId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        userId,
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to update seat');
    }
    
    return data.data;
  }

  /**
   * Get user's reservations
   */
  async getUserReservations(userId: string): Promise<ReservationData[]> {
    const response = await fetch(`${this.baseUrl}/api/reservations?userId=${userId}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch reservations');
    }
    
    return data.data;
  }
}

/**
 * Hook for using cinema API in React components
 */
export function useCinemaAPI() {
  const api = new CinemaAPI();

  return {
    getSeats: api.getSeats.bind(api),
    getMovies: api.getMovies.bind(api),
    getMovie: api.getMovie.bind(api),
    createReservation: api.createReservation.bind(api),
    cancelReservation: api.cancelReservation.bind(api),
    updateSeatStatus: api.updateSeatStatus.bind(api),
    getUserReservations: api.getUserReservations.bind(api),
  };
}

/**
 * Example usage in a React Three Fiber component:
 * 
 * ```tsx
 * import { useCinemaAPI } from '@/utils/cinema-api';
 * 
 * function CinemaScene() {
 *   const api = useCinemaAPI();
 *   const [seats, setSeats] = useState<SeatData[]>([]);
 *   const [movies, setMovies] = useState<MovieData[]>([]);
 * 
 *   useEffect(() => {
 *     // Load seats and movies
 *     Promise.all([
 *       api.getSeats(),
 *       api.getMovies()
 *     ]).then(([seatsData, moviesData]) => {
 *       setSeats(seatsData);
 *       setMovies(moviesData);
 *     });
 *   }, []);
 * 
 *   const handleSeatClick = async (seatId: string, movieId: string) => {
 *     try {
 *       await api.createReservation(seatId, movieId, 'current-user-id');
 *       // Update 3D scene
 *     } catch (error) {
 *       console.error('Failed to reserve seat:', error);
 *     }
 *   };
 * 
 *   return (
 *     // Your 3D scene JSX
 *   );
 * }
 * ```
 */
