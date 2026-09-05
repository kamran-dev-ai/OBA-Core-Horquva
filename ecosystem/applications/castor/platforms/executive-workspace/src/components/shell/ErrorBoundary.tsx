import  { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Executive Workspace crashed:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center h-screen w-full bg-slate-50 text-center px-4"
        >
          <div className="text-4xl mb-3" aria-hidden="true">⚠️</div>
          <h1 className="text-lg font-semibold text-slate-800">
            {this.props.fallbackTitle ?? 'Something went wrong'}
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            An unexpected error occurred in the workspace. You can try reloading this section.
          </p>
          <button
            onClick={this.handleReset}
            className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-50"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;