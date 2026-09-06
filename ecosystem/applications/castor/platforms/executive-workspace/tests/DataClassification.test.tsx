import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WidgetContainer from '../src/components/widgets/WidgetContainer';

describe('DataClassificationBadge integration', () => {
  it('shows the Demo Data badge when dataClassification is demo', () => {
    render(
      <WidgetContainer id="test-widget" title="Test Widget" dataClassification="demo">
        <p>Content</p>
      </WidgetContainer>
    );
    expect(screen.getByText('Demo Data')).toBeInTheDocument();
  });

  it('shows the Live Data badge when dataClassification is real', () => {
    render(
      <WidgetContainer id="test-widget-2" title="Test Widget 2" dataClassification="real">
        <p>Content</p>
      </WidgetContainer>
    );
    expect(screen.getByText('Live Data')).toBeInTheDocument();
  });

  it('shows no badge when dataClassification is not provided', () => {
    render(
      <WidgetContainer id="test-widget-3" title="Test Widget 3">
        <p>Content</p>
      </WidgetContainer>
    );
    expect(screen.queryByText('Demo Data')).not.toBeInTheDocument();
    expect(screen.queryByText('Live Data')).not.toBeInTheDocument();
  });
});