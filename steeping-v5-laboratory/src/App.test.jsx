import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Steeperverse App Initialization', () => {
    it('should render the entrance screen correctly', () => {
        // App includes ErrorBoundary and AppInner
        const { container } = render(<App />);
        expect(container).toBeInTheDocument();
        
        // Assert the entrance screen content. The headline's first word is wrapped in its
        // own <span> for accent styling, so its text is split across sibling nodes —
        // match on the heading element's full textContent rather than a single text node.
        const header = container.querySelector('.entrance-headline');
        expect(header).toBeInTheDocument();
        expect(header.textContent).toMatch(/Who do I/i);
    });
});
