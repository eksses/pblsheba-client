import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../useAuthStore';

// Mock persist middleware by clearing it manually if needed, 
// or just testing the state transitions.

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    localStorage.clear();
  });

  it('should initialize with default values', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
  });

  it('should login successfully (state update)', () => {
    const mockUser = { id: '1', name: 'John' };
    const mockToken = 'valid-token';
    
    useAuthStore.getState().login(mockUser, mockToken);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
  });

  it('should logout and clear state', () => {
    useAuthStore.setState({ isAuthenticated: true, user: { id: '1' }, token: 'secret' });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
    expect(state.token).toBe(null);
  });
});
