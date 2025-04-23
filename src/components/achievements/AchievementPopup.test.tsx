
import { render, screen, waitFor, fireEvent } from '@/utils/testUtils';
import AchievementPopup from './AchievementPopup';
import { vi } from 'vitest';

describe('AchievementPopup', () => {
  const mockAchievement = {
    id: 'test-achievement',
    name: 'Test Achievement',
    description: 'This is a test achievement',
    icon: 'trophy',
    category: 'battle' as const,
    rarity: 'common' as const,
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders achievement details', () => {
    render(<AchievementPopup achievement={mockAchievement} onClose={mockOnClose} />);
    
    expect(screen.getByText('Achievement Unlocked!')).toBeInTheDocument();
    expect(screen.getByText('Test Achievement')).toBeInTheDocument();
    expect(screen.getByText('This is a test achievement')).toBeInTheDocument();
  });

  test('closes automatically after timeout', async () => {
    render(<AchievementPopup achievement={mockAchievement} onClose={mockOnClose} />);
    
    // Fast-forward time to trigger auto-close
    vi.advanceTimersByTime(8100);
    
    // Check if onClose was called
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('closes when close button is clicked', () => {
    render(<AchievementPopup achievement={mockAchievement} onClose={mockOnClose} />);
    
    // Click the close button
    fireEvent.click(screen.getByRole('button'));
    
    // Advance timers to allow animation to complete
    vi.advanceTimersByTime(400);
    
    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });
});
