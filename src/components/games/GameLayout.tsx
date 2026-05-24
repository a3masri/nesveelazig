import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Confetti } from '../Particles';

type GameLayoutProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  confetti?: boolean;
  result?: { type: 'win' | 'lose' | 'info'; message: string } | null;
};

export function GameLayout({ title, subtitle, children, confetti = false, result }: GameLayoutProps) {
  return (
    <div className="animate-fade-in max-w-lg mx-auto w-full overflow-x-hidden">
      <Confetti active={confetti} />
      <Link
        to="/oyunlar"
        className="btn-duo btn-duo-ghost inline-flex items-center gap-2 mb-4 text-sm min-h-[44px] px-4"
      >
        <ArrowLeft className="w-4 h-4" /> Oyunlar
      </Link>
      <header className="text-center mb-6">
        <h1 className="font-display text-xl sm:text-2xl font-bold uppercase" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-1 px-2" style={{ color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        )}
      </header>
      {result && (
        <div
          className={`mb-4 px-4 py-3 rounded-2xl text-center text-sm font-bold animate-bounce-in ${
            result.type === 'win'
              ? 'bg-cr-green/15 border border-cr-green/40 text-cr-green'
              : result.type === 'lose'
                ? 'bg-cr-red/15 border border-cr-red/40'
                : 'surface-panel'
          }`}
          style={result.type === 'info' ? { color: 'var(--text-secondary)' } : undefined}
        >
          {result.message}
        </div>
      )}
      {children}
    </div>
  );
}
