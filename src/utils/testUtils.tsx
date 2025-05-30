
import React, { ReactElement } from 'react';
// Import 'render' and 'RenderOptions' from @testing-library/react
import { 
  render as rtlRender, 
  RenderOptions
} from '@testing-library/react';
// Import screen, waitFor, fireEvent from @testing-library/dom which is a peer dependency
import { screen, waitFor, fireEvent } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import '@testing-library/jest-dom'; // For side effects like adding .toBeInTheDocument()

// Add type extension for testing-library matchers
// This helps if you're using Vitest with Jest-like assertions
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

// Create a custom render method that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

// Custom render function now uses rtlRender internally
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => rtlRender(ui, { wrapper: AllTheProviders, ...options });

// Explicitly re-export the custom render function (aliased as 'render')
// and the other utilities from @testing-library/dom
export { customRender as render, screen, waitFor, fireEvent };

// If you find you need other utilities from @testing-library/react later on
// (e.g., within, act), you'll need to add them to the import statement at the top
// and then also to the export statement above.
