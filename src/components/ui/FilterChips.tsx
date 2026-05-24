type FilterChipsProps<T extends string> = {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
};

export function FilterChips<T extends string>({ options, value, onChange }: FilterChipsProps<T>) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`btn-duo px-4 py-2.5 min-h-[44px] rounded-2xl text-xs whitespace-nowrap shrink-0 ${value === opt.value ? 'btn-duo-blue' : 'btn-duo-ghost'}`}
        >
          {opt.label}
          {opt.count !== undefined ? ` (${opt.count})` : ''}
        </button>
      ))}
    </div>
  );
}
