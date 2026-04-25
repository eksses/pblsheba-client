import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../useAuthStore';
import axiosClient from '../../api/axiosClient';

vi.mock('../../api/axiosClient');

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Zustand state manually if needed, or just rely on fresh imports if possible
    // For Zustand, we might need a reset pattern.
  });

  it('should initialize with default values', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
    expect(state.loading).toBe(false);
  });

  it('should login successfully', async () => {
    const mockUser = { id: '1', name: 'John' };
    const mockToken = 'valid-token';
    axiosClient.post.mockResolvedValueOnce({ 
      data: { user: mockUser, token: mockToken } 
    });

    await useAuthStore.getState().login('01712345678', 'password');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(localStorage.getItem('pbl_token')).toBe(mockToken);
  });

  it('should logout and clear state', () => {
    localStorage.setItem('pbl_token', 'some-token');
    useAuthStore.setState({ isAuthenticated: true, user: { id: '1' } });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
    expect(localStorage.getItem('pbl_token')).toBe(null);
  });
});
