import React from 'react';
import { WidgetContainerProps } from '../../types/workspace.types';
import DataClassificationBadge from './DataClassificationBadge';

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  id,
  title,
  subtitle,
  isLoading = false,
  error,
  state,
  onRetry,
  children,
  onRefresh,
  dataClassification,
}) => {
  return (
    <div
      id={id}
      className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm h-full"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
            {dataClassification && (
              <DataClassificationBadge classification={dataClassification} />
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              aria-label="Refresh widget"
              className="text-slate-400 hover:text-slate-700 transition-colors text-sm px-2 py-1 rounded-md hover:bg-slate-100"
            >
              ⟳
            </button>
          )}
          <button
            aria-label="Widget menu"
            className="text-slate-400 hover:text-slate-700 transition-colors text-sm px-2 py-1 rounded-md hover:bg-slate-100"
          >
            ⋯
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 w-full h-full">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-24 bg-slate-200 rounded" />
          </div>
        ) : error ? (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2"
          >
            <span>⚠</span>
            <span>{error}</span>
          </div>
        ) : state === 'unauthorized' ? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center text-center gap-2 py-6 text-sm text-slate-600"
          >
            <span aria-hidden="true">🔒</span>
            <p>You don't have permission to view this data.</p>
          </div>
        ) : state === 'offline' ? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center text-center gap-2 py-6 text-sm text-slate-600"
          >
            <span aria-hidden="true">📡</span>
            <p>Unable to reach the data source. Check your connection.</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50"
              >
                Retry
              </button>
            )}
          </div>
        ) : (
          <div className="w-full h-full">
            {state === 'stale' && (
              <div
                role="status"
                className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1 mb-3"
              >
                <span aria-hidden="true">🕓</span>
                <span>This data may be out of date.</span>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="ml-auto font-medium hover:underline"
                  >
                    Refresh
                  </button>
                )}
              </div>
            )}
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetContainer;