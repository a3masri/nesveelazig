type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="text-xs font-bold mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <input
        className={`ui-input w-full ${className}`}
        {...props}
      />
    </div>
  );
}
