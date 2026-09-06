import React, { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export interface TabItem {
  label: string;
  path: string;
}

interface WorkspaceTabsProps {
  tabs: TabItem[];
}

export const WorkspaceTabs: React.FC<WorkspaceTabsProps> = ({ tabs }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      tabRefs.current[nextIndex]?.focus();
      navigate(tabs[nextIndex].path);
    }
  };

  return (
    <div role="tablist" aria-label="Workspace tabs" className="flex items-center gap-1 border-b border-slate-200 px-4">
      {tabs.map((tab, index) => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            ref={(el) => (tabRefs.current[index] = el)}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              isActive
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

export default WorkspaceTabs;