import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Steeperverse App Initialization', () => {
    it('should render the entrance screen correctly', () => {
        // App includes ErrorBoundary and AppInner
        const { container } = render(<App />);
        expect(container).toBeInTheDocument();
        
        // Assert the entrance screen content
        const header = screen.getByText(/Who do I/i);
        expect(header).toBeInTheDocument();
    });
});
