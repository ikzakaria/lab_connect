import { STATUS_CONFIG } from '../utils/constants';
export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <i className={`fa-solid ${cfg.icon} text-[10px]`} />{cfg.label}
    </span>
  );
}
