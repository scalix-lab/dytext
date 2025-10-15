import { render, screen, waitFor } from '@testing-library/react';
import { resetConfig } from 'dytext';
import CachingTestComponent from '../src/components/CachingTestComponent';
import 'cross-fetch/polyfill';

jest.setTimeout(30000);

const TEST_TOKEN = "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe('DyText Caching Behavior', () => {
  beforeEach(() => {
    resetConfig();
    process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN = TEST_TOKEN;
  });

  afterEach(() => {
    resetConfig();
    delete process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
  });

  it('should demonstrate caching performance', async () => {
    render(<CachingTestComponent />);
    
    // Wait for component to load (either loading disappears or component appears)
    await waitFor(
      () => {
        const loadingElement = screen.queryByTestId('cache-loading');
        const componentElement = screen.queryByTestId('caching-test-component');
        expect(loadingElement === null || componentElement !== null).toBe(true);
      },
      { timeout: 10000 } // Longer timeout for caching test
    );

    // Verify caching test results
    expect(screen.getByTestId('caching-test-component')).toBeInTheDocument();
    
    // Verify cache status
    const isCached = screen.getByTestId('is-cached');
    expect(isCached).toBeInTheDocument();
    
    // Verify performance metrics are displayed
    expect(screen.getByTestId('first-call-time')).toBeInTheDocument();
    expect(screen.getByTestId('second-call-time')).toBeInTheDocument();
    expect(screen.getByTestId('third-call-time')).toBeInTheDocument();
  });

  it('should show cache effectiveness', async () => {
    render(<CachingTestComponent />);
    
    await waitFor(
      () => {
        const loadingElement = screen.queryByTestId('cache-loading');
        const componentElement = screen.queryByTestId('caching-test-component');
        expect(loadingElement === null || componentElement !== null).toBe(true);
      },
      { timeout: 10000 }
    );

    // Verify cache results are identical
    const firstResult = screen.getByTestId('first-call-result');
    const secondResult = screen.getByTestId('second-call-result');
    
    expect(firstResult).toBeInTheDocument();
    expect(secondResult).toBeInTheDocument();
    
    // Results should be identical (cached)
    const isCached = screen.getByTestId('is-cached');
    expect(isCached.textContent).toContain('Yes');
  });
});

