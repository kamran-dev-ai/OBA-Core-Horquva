import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NotFoundPage from '../src/components/shell/NotFoundPage';

describe('NotFoundPage', () => {
  it('renders the not-found message and a link back to Overview', () => {
    render(
      <MemoryRouter initialEntries={['/some/bad/path']}>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByText('Back to Overview')).toBeInTheDocument();
  });
});