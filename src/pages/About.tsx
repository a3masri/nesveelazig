import { Link } from 'react-router-dom';
import { Coffee, Snowflake, Flower2, Sun, Leaf, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { SEASON_PATH } from '../lib/constants';

export default function About() {
  const seasonIcons = { kis: Snowflake, ilkbahar: Flower2, yaz: Sun, sonbahar: Leaf };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto border-b" style={{ borderColor: 'var(--border)' }}>
        <Logo size="md" linkTo="/" />
        <Link to="/kayit" className="btn-duo btn-duo-green px-4 py-2 rounded-2xl text-sm flex items-center gap-2">
          Katıl <ArrowRight className="w-4 h-4" />
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10 animate-fade-in">
        <div>
          <h1 className="font-display text-4xl font-bold text-stroke mb-4" style={{ color: 'var(--text-primary)' }}>
            Hakkımızda
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Neşve, kahve tutkunları için tasarlanmış bir sadakat ve macera platformudur. Her fincan bir kupa,
            her kupa bir adım — dört mevsim boyunca süren yolculuğunda seni ödüllendiriyoruz.
          </p>
        </div>

        <div className="rounded-2xl p-6 flex items-start gap-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <Coffee className="w-8 h-8 text-cr-gold flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-display text-xl font-bold mb-2 uppercase" style={{ color: 'var(--text-primary)' }}>
              Misyonumuz
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Kahve deneyimini oyunlaştırarak her ziyareti unutulmaz kılmak. Kupalarını topla, kartlarını aç,
              rozetlerini kazan ve topluluğumuzda yüksel.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold mb-6 uppercase" style={{ color: 'var(--text-primary)' }}>
            Mevsim Yolu
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {SEASON_PATH.map(season => {
              const Icon = seasonIcons[season.id];
              return (
                <div key={season.id} className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: `2px solid ${season.color}40` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{season.emoji}</span>
                    <Icon className="w-5 h-5" style={{ color: season.color }} />
                    <h3 className="font-display font-bold uppercase" style={{ color: 'var(--text-primary)' }}>{season.name}</h3>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{season.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center pt-4">
          <Link to="/" className="text-sm hover:text-cr-gold transition-colors" style={{ color: 'var(--text-muted)' }}>
            ← Ana sayfaya dön
          </Link>
        </div>
      </main>
    </div>
  );
}
