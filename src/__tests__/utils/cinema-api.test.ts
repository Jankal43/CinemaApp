import { CinemaAPI } from '@/utils/cinema-api';


global.fetch = jest.fn();

describe('CinemaAPI', () => {
  let api: CinemaAPI;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    api = new CinemaAPI();
    mockFetch.mockClear();
  });

  describe('getSeats', () => {
    it('should fetch all seats without filters', async () => {
      const mockSeats = [
        { id: '1', row: 1, column: 1, status: 'free' },
        { id: '2', row: 1, column: 2, status: 'free' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockSeats,
        }),
      } as Response);

      const seats = await api.getSeats();

      expect(mockFetch).toHaveBeenCalledWith('/api/seats?');
      expect(seats).toEqual(mockSeats);
    });

    it('should fetch seats with filters', async () => {
      const mockSeats = [
        { id: '1', row: 1, column: 1, status: 'free' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockSeats,
        }),
      } as Response);

      const seats = await api.getSeats({ status: 'free', row: 1 });

      expect(mockFetch).toHaveBeenCalledWith('/api/seats?status=free&row=1');
      expect(seats).toEqual(mockSeats);
    });

    it('should throw error when API returns error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: 'Failed to fetch seats',
        }),
      } as Response);

      await expect(api.getSeats()).rejects.toThrow('Failed to fetch seats');
    });
  });

  describe('getMovies', () => {
    it('should fetch all movies without filters', async () => {
      const mockMovies = [
        { id: '1', title: 'Movie 1', description: 'Description 1', posterUrl: '', trailerUrl: '', audioStereoUrl: '' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockMovies,
        }),
      } as Response);

      const movies = await api.getMovies();

      expect(mockFetch).toHaveBeenCalledWith('/api/movies?');
      expect(movies).toEqual(mockMovies);
    });

    it('should fetch movies with filters', async () => {
      const mockMovies = [
        { id: '1', title: 'Action Movie', description: 'Description', posterUrl: '', trailerUrl: '', audioStereoUrl: '' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockMovies,
        }),
      } as Response);

      const movies = await api.getMovies({ search: 'action', genre: 'Action', limit: 10, page: 1 });

      expect(mockFetch).toHaveBeenCalledWith('/api/movies?search=action&genre=Action&limit=10&page=1');
      expect(movies).toEqual(mockMovies);
    });
  });

  describe('getMovie', () => {
    it('should fetch a specific movie by ID', async () => {
      const mockMovie = {
        id: '1',
        title: 'Movie 1',
        description: 'Description',
        posterUrl: '',
        trailerUrl: '',
        audioStereoUrl: '',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockMovie,
        }),
      } as Response);

      const movie = await api.getMovie('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/movies/1');
      expect(movie).toEqual(mockMovie);
    });

    it('should throw error when movie not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: 'Movie not found',
        }),
      } as Response);

      await expect(api.getMovie('999')).rejects.toThrow('Movie not found');
    });
  });

  describe('createReservation', () => {
    it('should create a reservation', async () => {
      const mockReservation = {
        id: '1',
        seatId: 'seat1',
        movieId: 'movie1',
        userId: 'user1',
        timestamp: '2024-01-01T00:00:00Z',
        status: 'active' as const,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockReservation,
        }),
      } as Response);

      const reservation = await api.createReservation('seat1', 'movie1', 'user1');

      expect(mockFetch).toHaveBeenCalledWith('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seatId: 'seat1',
          movieId: 'movie1',
          userId: 'user1',
        }),
      });
      expect(reservation).toEqual(mockReservation);
    });

    it('should throw error when creation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: 'Seat already taken',
        }),
      } as Response);

      await expect(api.createReservation('seat1', 'movie1', 'user1')).rejects.toThrow('Seat already taken');
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
        }),
      } as Response);

      await api.cancelReservation('reservation1');

      expect(mockFetch).toHaveBeenCalledWith('/api/reservations/reservation1', {
        method: 'DELETE',
      });
    });

    it('should throw error when cancellation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: 'Reservation not found',
        }),
      } as Response);

      await expect(api.cancelReservation('reservation1')).rejects.toThrow('Reservation not found');
    });
  });

  describe('updateSeatStatus', () => {
    it('should update seat status', async () => {
      const mockSeat = {
        id: '1',
        row: 1,
        column: 1,
        status: 'taken' as const,
        userId: 'user1',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockSeat,
        }),
      } as Response);

      const seat = await api.updateSeatStatus('seat1', 'taken', 'user1');

      expect(mockFetch).toHaveBeenCalledWith('/api/seats/seat1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'taken',
          userId: 'user1',
        }),
      });
      expect(seat).toEqual(mockSeat);
    });
  });

  describe('getUserReservations', () => {
    it('should fetch user reservations', async () => {
      const mockReservations = [
        {
          id: '1',
          seatId: 'seat1',
          movieId: 'movie1',
          userId: 'user1',
          timestamp: '2024-01-01T00:00:00Z',
          status: 'active' as const,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockReservations,
        }),
      } as Response);

      const reservations = await api.getUserReservations('user1');

      expect(mockFetch).toHaveBeenCalledWith('/api/reservations?userId=user1');
      expect(reservations).toEqual(mockReservations);
    });
  });
});
