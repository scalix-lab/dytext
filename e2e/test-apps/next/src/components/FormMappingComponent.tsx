'use client';

import { useEffect, useState } from 'react';
import { initDytext, getDytext } from 'dytext';

const TEST_TOKEN = "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

interface FormField {
  [key: string]: {
    value: any;
  };
}

interface UserProfile {
  name: string;
  fields: FormField[];
}

export default function FormMappingComponent() {
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFormData() {
      try {
        await initDytext(TEST_TOKEN);
        const result = await getDytext('user-profile') as UserProfile;
        setFormData(result);
        
        // Initialize form values
        const initialValues: Record<string, string> = {};
        result.fields.forEach(field => {
          // Get the first key from the field object as the field name
          const fieldName = Object.keys(field)[0];
          if (fieldName) {
            initialValues[fieldName] = '';
          }
        });
        setFormValues(initialValues);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFormData();
  }, []);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit the form data
    console.log('Form submitted with values:', formValues);
  };

  if (isLoading) return <div data-testid="form-loading">Loading form data...</div>;
  if (error) return <div data-testid="form-error">Error: {error}</div>;
  if (!formData) return <div data-testid="form-no-data">No form data available</div>;

  return (
    <div data-testid="form-mapping-component">
      <h2 data-testid="form-title">{formData.name} Form</h2>
      <form onSubmit={handleSubmit} data-testid="dynamic-form">
        {formData.fields.map((field, index) => {
          const fieldName = Object.keys(field)[0];
          const fieldValue = field[fieldName]?.value;
          
          return (
            <div key={index} data-testid={`form-field-${index}`}>
              <label 
                htmlFor={fieldName}
                data-testid={`field-label-${index}`}
              >
                {fieldName}
              </label>
              <input
                id={fieldName}
                type="text"
                placeholder={`Enter ${fieldName}`}
                value={formValues[fieldName] || ''}
                onChange={(e) => handleInputChange(fieldName, e.target.value)}
                data-testid={`field-input-${index}`}
              />
            </div>
          );
        })}
        <button type="submit" data-testid="submit-button">Submit</button>
      </form>
      <div data-testid="form-values-display">
        Current values: {JSON.stringify(formValues)}
      </div>
    </div>
  );
}
