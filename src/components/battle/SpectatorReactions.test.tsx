
import { render, screen, fireEvent, waitFor } from '@/utils/testUtils';
import SpectatorReactions from './SpectatorReactions';
import { supabase } from '@/integrations/supabase/client';
import { vi } from 'vitest';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null })),
          })),
        })),
      })),
      insert: vi.fn(() => Promise.resolve({ error: null })),
      delete: vi.fn(() => Promise.resolve({ error: null })),
    })),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(),
      })),
    })),
    removeChannel: vi.fn(),
  },
}));

// Mock AuthContext
vi.mock('@/context/AuthContext', () => ({
  useAuthContext: vi.fn(() => ({
    user: { id: 'test-user-id' },
  })),
}));

// Mock toast
vi.mock('@/components/ui/sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('SpectatorReactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders reaction buttons', () => {
    render(<SpectatorReactions battleId="test-battle-id" />);
    
    // Check if all reaction buttons are rendered
    expect(screen.getByText('🔥')).toBeInTheDocument();
    expect(screen.getByText('😂')).toBeInTheDocument();
    expect(screen.getByText('👍')).toBeInTheDocument();
    expect(screen.getByText('👎')).toBeInTheDocument();
    expect(screen.getByText('❤️')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  test('clicking a reaction button calls handleReaction', async () => {
    render(<SpectatorReactions battleId="test-battle-id" />);
    
    // Click the fire reaction button
    fireEvent.click(screen.getByText('🔥'));
    
    // Check if supabase insert was called
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('battle_reactions');
    });
  });
});
