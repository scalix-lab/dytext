"use client";

import SpecificModelComponent from "../../components/SpecificModelComponent";
import DottedPathComponent from "../../components/DottedPathComponent";
import FormMappingComponent from "../../components/FormMappingComponent";
import CachingTestComponent from "../../components/CachingTestComponent";
import ErrorHandlingComponent from "../../components/ErrorHandlingComponent";
import RealTimeDataComponent from "../../components/RealTimeDataComponent";
import ConditionalRenderingComponent from "../../components/ConditionalRenderingComponent";

export default function ComprehensiveTestPage() {
  return (
    <main data-testid="comprehensive-test-page">
      <h1>DyText Comprehensive Test Suite</h1>

      <section data-testid="specific-model-section">
        <h2>Specific Model Fetching</h2>
        <SpecificModelComponent />
      </section>

      <section data-testid="dotted-path-section">
        <h2>Dotted Path Access</h2>
        <DottedPathComponent />
      </section>

      <section data-testid="form-mapping-section">
        <h2>Form Field Mapping</h2>
        <FormMappingComponent />
      </section>

      <section data-testid="caching-section">
        <h2>Caching Behavior</h2>
        <CachingTestComponent />
      </section>

      <section data-testid="error-handling-section">
        <h2>Error Handling</h2>
        <ErrorHandlingComponent />
      </section>

      <section data-testid="realtime-section">
        <h2>Real-Time Data Management</h2>
        <RealTimeDataComponent />
      </section>

      <section data-testid="conditional-section">
        <h2>Conditional Rendering</h2>
        <ConditionalRenderingComponent />
      </section>
    </main>
  );
}
