import { APP_NAME } from '../config';

export default function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className="flex h-5 items-end gap-0.5">
        <span className="h-2 w-1.5 rounded-[1px] bg-ink" />
        <span className="h-3.5 w-1.5 rounded-[1px] bg-ink" />
        <span className="h-5 w-1.5 rounded-[1px] bg-forge" />
      </span>
      <span className="font-semibold tracking-tight text-ink">{APP_NAME}</span>
    </span>
  );
}