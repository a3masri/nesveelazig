export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center min-h-[50vh] ${className}`}>
      <div className="w-10 h-10 border-[3px] border-cr-gold/30 border-t-cr-gold rounded-full animate-spin" />
    </div>
  );
}
