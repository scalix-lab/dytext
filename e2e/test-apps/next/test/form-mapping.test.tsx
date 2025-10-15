import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { resetConfig } from 'dytext';
import FormMappingComponent from '../src/components/FormMappingComponent';
import 'cross-fetch/polyfill';

jest.setTimeout(30000);

const TEST_TOKEN = "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe('DyText Form Field Mapping', () => {
  beforeEach(() => {
    resetConfig();
    process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN = TEST_TOKEN;
  });

  afterEach(() => {
    resetConfig();
    delete process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
  });

  it('should map model fields to form components', async () => {
    render(<FormMappingComponent />);
    
    await waitFor(
      () => {
        const loadingElement = screen.queryByTestId('form-loading');
        const componentElement = screen.queryByTestId('form-mapping-component');
        expect(loadingElement === null || componentElement !== null).toBe(true);
      },
      { timeout: 5000 }
    );

    // Verify form renders
    expect(screen.getByTestId('form-mapping-component')).toBeInTheDocument();
    expect(screen.getByTestId('dynamic-form')).toBeInTheDocument();
    
    // Verify form fields are mapped
    const formFields = screen.getAllByTestId(/form-field-\d+/);
    expect(formFields.length).toBeGreaterThan(0);
    
    // Verify field labels and inputs exist
    expect(screen.getByTestId('field-label-0')).toBeInTheDocument();
    expect(screen.getByTestId('field-input-0')).toBeInTheDocument();
    
    // Verify submit button exists
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should handle form interactions', async () => {
    render(<FormMappingComponent />);
    
    await waitFor(
      () => {
        const loadingElement = screen.queryByTestId('form-loading');
        const componentElement = screen.queryByTestId('form-mapping-component');
        expect(loadingElement === null || componentElement !== null).toBe(true);
      },
      { timeout: 5000 }
    );

    // Find first input field
    const firstInput = screen.getByTestId('field-input-0');
    expect(firstInput).toBeInTheDocument();
    
    // Type in the input
    fireEvent.change(firstInput, { target: { value: 'Test Value' } });
    
    // Verify the value is updated
    expect(firstInput).toHaveValue('Test Value');
    
    // Verify form values display is updated
    await waitFor(() => {
      const formValuesDisplay = screen.getByTestId('form-values-display');
      expect(formValuesDisplay.textContent).toContain('Test Value');
    });
  });

  it('should handle form submission', async () => {
    render(<FormMappingComponent />);
    
    await waitFor(
      () => {
        const loadingElement = screen.queryByTestId('form-loading');
        const componentElement = screen.queryByTestId('form-mapping-component');
        expect(loadingElement === null || componentElement !== null).toBe(true);
      },
      { timeout: 5000 }
    );

    // Fill in a field
    const firstInput = screen.getByTestId('field-input-0');
    fireEvent.change(firstInput, { target: { value: 'Test Value' } });
    
    // Submit the form
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    // Form should submit without errors (we're just testing the interaction)
    expect(submitButton).toBeInTheDocument();
  });
});

