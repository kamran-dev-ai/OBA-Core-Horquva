import { DataClassification } from '../../types/workspace.types';

interface DataClassificationBadgeProps {
  classification: DataClassification;
}

const labelMap: Record<DataClassification, string> = {
  real: 'Live Data',
  demo: 'Demo Data',
  test: 'Test Data',
  blocked: 'Data Unavailable',
};

const colorMap: Record<DataClassification, string> = {
  real: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  demo: 'bg-amber-50 text-amber-700 border-amber-200',
  test: 'bg-slate-100 text-slate-600 border-slate-200',
  blocked: 'bg-red-50 text-red-700 border-red-200',
};

interface DataClassificationBadgeComponent {
  (props: DataClassificationBadgeProps): JSX.Element;
}

export const DataClassificationBadge: DataClassificationBadgeComponent = ({
  classification,
}) => {
  return (
    <span
      className={`text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded border ${colorMap[classification]}`}
    >
      {labelMap[classification]}
    </span>
  );
};

export default DataClassificationBadge;