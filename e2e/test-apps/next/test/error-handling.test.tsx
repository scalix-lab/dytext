import { render, screen, waitFor } from '@testing-library/react';
import ErrorHandlingComponent from '../src/components/ErrorHandlingComponent';
import { resetConfig } from 'dytext';
import 'cross-fetch/polyfill';

jest.setTimeout(30000);

const TEST_TOKEN = "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe('DyText Error Handling', () => {
  beforeEach(() => {
    resetConfig();
    process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN = TEST_TOKEN;
  });

  afterEach(() => {
    resetConfig();
    delete process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
  });

  it('should handle non-existent models gracefully', async () => {
    render(<ErrorHandlingComponent />);
    
    await waitFor(
      () => {
        const loadingElement = screen.queryByTestId('error-loading');
        const componentElement = screen.queryByTestId('error-handling-component');
        expect(loadingElement === null || componentElement !== null).toBe(true);
      },
      { timeout: 5000 }
    );

    // Verify error handling component renders
    expect(screen.getByTestId('error-handling-component')).toBeInTheDocument();
    
    // Verify non-existent model returns undefined
    expect(screen.getByTestId('non-existent-model-result')).toHaveTextContent('undefined');
    
    // Verify invalid paths return undefined
    expect(screen.getByTestId('invalid-path-result')).toHaveTextContent('undefined');
    expect(screen.getByTestId('deep-invalid-path-result')).toHaveTextContent('undefined');
    
    // Verify empty path still returns data
    expect(screen.getByTestId('empty-path-result')).toHaveTextContent('has data');
  });

  it('should handle all error scenarios gracefully', async () => {
    render(<ErrorHandlingComponent />);
    
    await waitFor(
      () => {
        const loadingElement = screen.queryByTestId('error-loading');
        const componentElement = screen.queryByTestId('error-handling-component');
        expect(loadingElement === null || componentElement !== null).toBe(true);
      },
      { timeout: 5000 }
    );

    // Verify graceful handling summary
    const gracefulHandling = screen.getByTestId('graceful-handling');
    expect(gracefulHandling.textContent).toContain('Yes');
  });
});

