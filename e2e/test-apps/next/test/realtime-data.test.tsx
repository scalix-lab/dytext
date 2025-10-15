import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { resetConfig } from 'dytext';
import RealTimeDataComponent from '../src/components/RealTimeDataComponent';
import 'cross-fetch/polyfill';

jest.setTimeout(30000);

const TEST_TOKEN = "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe('DyText Real-Time Data Management', () => {
  beforeEach(() => {
    resetConfig();
    process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN = TEST_TOKEN;
  });

  afterEach(() => {
    resetConfig();
    delete process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
  });

  it('should handle data refresh functionality', async () => {
    render(<RealTimeDataComponent />);
    
    await waitFor(
      () => {
        const loadingElement = screen.queryByTestId('realtime-loading');
        const componentElement = screen.queryByTestId('realtime-data-component');
        expect(loadingElement === null || componentElement !== null).toBe(true);
      },
      { timeout: 5000 }
    );

    // Verify component renders
    expect(screen.getByTestId('realtime-data-component')).toBeInTheDocument();
    
    // Verify initial data is loaded
    expect(screen.getByTestId('models-count')).toBeInTheDocument();
    expect(screen.getByTestId('models-list')).toBeInTheDocument();
    expect(screen.getByTestId('refresh-count')).toHaveTextContent('Refresh count: 1');
    
    // Test refresh functionality
    const refreshButton = screen.getByTestId('refresh-button');
    expect(refreshButton).toBeInTheDocument();
    
    fireEvent.click(refreshButton);
    
    // Wait for refresh to complete
    await waitFor(
      () => {
        expect(screen.getByTestId('refresh-count')).toHaveTextContent('Refresh count: 2');
      },
      { timeout: 5000 }
    );
  });

  it('should show loading state during refresh', async () => {
    render(<RealTimeDataComponent />);
    
    await waitFor(
      () => {
        const loadingElement = screen.queryByTestId('realtime-loading');
        const componentElement = screen.queryByTestId('realtime-data-component');
        expect(loadingElement === null || componentElement !== null).toBe(true);
      },
      { timeout: 5000 }
    );

    const refreshButton = screen.getByTestId('refresh-button');
    fireEvent.click(refreshButton);
    
    // Button should show loading state
    expect(refreshButton).toHaveTextContent('Refreshing...');
    expect(refreshButton).toBeDisabled();
  });
});

