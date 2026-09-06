import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WidgetContainer from '../src/components/widgets/WidgetContainer';

describe('WidgetContainer failure states', () => {
  it('renders the unauthorized state', () => {
    render(
      <WidgetContainer id="w-unauth" title="Restricted Widget" state="unauthorized">
        <p>Hidden content</p>
      </WidgetContainer>
    );
    expect(screen.getByText("You don't have permission to view this data.")).toBeInTheDocument();
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('renders the offline state with a retry action', () => {
    const onRetry = vi.fn();
    render(
      <WidgetContainer id="w-offline" title="Offline Widget" state="offline" onRetry={onRetry}>
        <p>Hidden content</p>
      </WidgetContainer>
    );
    expect(screen.getByText('Unable to reach the data source. Check your connection.')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders the stale banner above content, without hiding it', () => {
    const onRetry = vi.fn();
    render(
      <WidgetContainer id="w-stale" title="Stale Widget" state="stale" onRetry={onRetry}>
        <p>Visible content</p>
      </WidgetContainer>
    );
    expect(screen.getByText('This data may be out of date.')).toBeInTheDocument();
    expect(screen.getByText('Visible content')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Refresh'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});