import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

const TestRangeSelector: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const range = searchParams.get('range') ?? '30d';

  return (
    <div>
      <p>Current range: {range}</p>
      <select
        aria-label="range-select"
        value={range}
        onChange={(e) => setSearchParams({ range: e.target.value })}
      >
        <option value="7d">7 days</option>
        <option value="30d">30 days</option>
      </select>
    </div>
  );
};

describe('Query parameter handling', () => {
  it('defaults to 30d when no range is in the URL', () => {
    render(
      <MemoryRouter initialEntries={['/overview']}>
        <Routes>
          <Route path="/overview" element={<TestRangeSelector />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Current range: 30d')).toBeInTheDocument();
  });

  it('reads the range value directly from the URL', () => {
    render(
      <MemoryRouter initialEntries={['/overview?range=7d']}>
        <Routes>
          <Route path="/overview" element={<TestRangeSelector />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Current range: 7d')).toBeInTheDocument();
  });

  it('updates the displayed range when the selector changes', () => {
    render(
      <MemoryRouter initialEntries={['/overview']}>
        <Routes>
          <Route path="/overview" element={<TestRangeSelector />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText('range-select'), { target: { value: '7d' } });
    expect(screen.getByText('Current range: 7d')).toBeInTheDocument();
  });
});
