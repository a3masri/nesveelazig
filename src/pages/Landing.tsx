import { Link } from 'react-router-dom';
import { Coffee, Trophy, ChevronRight, Zap, TrendingUp, Gift, Users, ArrowRight, Award, Flame, Crown, Snowflake, Flower2, Sun, Leaf } from 'lucide-react';
import { FloatingParticles } from '../components/Particles';
import { Logo } from '../components/Logo';
import { SEASON_PATH, RANKS } from '../lib/constants';

const features = [
  { icon: Zap, title: 'Kupa Kazan', desc: 'Her alışverişte bir sonraki arenaya yaklaş' },
  { icon: TrendingUp, title: 'Mevsim Yolunu Keşfet', desc: 'Kış, ilkbahar, yaz ve sonbahar boyunca ilerle' },
  { icon: Gift, title: 'Sandık Aç', desc: 'Kupalarını kahve, tatlı ve gizem ödülleriyle değiştir' },
  { icon: Flame, title: 'Seri Yap', desc: 'Günlük ziyaretlerle bonus kupalar kazan' },
  { icon: Trophy, title: 'Rozet Topla', desc: 'Başarı rozetlerini aç ve gücünü göster' },
  { icon: Crown, title: 'Sıralamada Yüksel', desc: 'Toplulukla yarış ve tacı kap' },
];

const seasonIcons = { kis: Snowflake, ilkbahar: Flower2, yaz: Sun, sonbahar: Leaf };

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <FloatingParticles emojis={['☕', '🥐', '🍵', '✨', '🍪', '☕']} count={18} />
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Logo size="xl" linkTo="/" />
        <div className="flex items-center gap-3">
          <Link to="/giris" className="btn-duo btn-duo-ghost px-4 py-2 rounded-2xl text-sm hidden sm:inline-flex">
            Giriş
          </Link>
          <Link to="/kayit" className="btn-duo btn-duo-green px-5 py-2.5 rounded-2xl text-sm flex items-center gap-2">
            Başla <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <div
          className="animate-bounce-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
          style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}
        >
          <Coffee className="w-3.5 h-3.5" />
          Kahve maceran burada başlıyor
        </div>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-stroke" style={{ color: 'var(--text-primary)' }}>
          Kahven
          <br />
          <span className="text-cr-gold">
            Seni Ödüllendirsin
          </span>
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
          Her ziyaretini bir maceraya dönüştür. Kupa kazan, mevsim yolunda ilerle, kart ödülleri topla ve Neşve imparatorluğunu kur.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/kayit" className="btn-duo btn-duo-green px-8 py-4 rounded-2xl text-base flex items-center gap-2">
            Maceraya Başla <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/hakkimizda" className="btn-duo btn-duo-blue px-8 py-4 rounded-2xl text-base flex items-center gap-2">
            Daha Fazla <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="relative z-10 py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-stroke" style={{ color: 'var(--text-primary)' }}>
              Dört Mevsim Yolu
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Kıştan sonbahara, her mevsimde yeni duraklar seni bekliyor</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {SEASON_PATH.map(season => {
              const SIcon = seasonIcons[season.id];
              return (
                <div
                  key={season.id}
                  className="card-hover rounded-2xl p-6 animate-slide-up"
                  style={{ background: 'var(--bg-card)', border: `2px solid ${season.color}50`, boxShadow: `0 0 20px ${season.color}20` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{season.emoji}</span>
                    <SIcon className="w-5 h-5" style={{ color: season.color }} />
                  </div>
                  <h3 className="font-display font-bold text-lg uppercase mb-2" style={{ color: 'var(--text-primary)' }}>
                    {season.name}
                  </h3>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{season.description}</p>
                  <div className="space-y-1">
                    {season.stops.map(s => (
                      <div key={s.rankName} className="text-[10px] font-bold uppercase" style={{ color: season.color }}>
                        {s.rankName} — {s.minPoints} kupa
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-stroke" style={{ color: 'var(--text-primary)' }}>
            Arenalar
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Her fincan seni efsane statüsüne yaklaştırır</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {RANKS.map((r, i) => (
            <div
              key={r.name}
              className="card-hover rounded-2xl p-5 text-center animate-slide-up"
              style={{ background: 'var(--bg-card)', border: `2px solid ${r.color}60`, animationDelay: `${i * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-lg font-bold" style={{ background: `${r.color}25`, color: r.color }}>
                {r.minPoints === 0 ? '0' : r.minPoints >= 1000 ? `${r.minPoints / 1000}K` : r.minPoints}
              </div>
              <h3 className="font-display font-bold text-[10px] mb-1 uppercase leading-tight" style={{ color: 'var(--text-primary)' }}>
                {r.name}
              </h3>
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{r.minPoints} kupa</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-stroke" style={{ color: 'var(--text-primary)' }}>
              Sadece Bir Kafe Değil
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Seni geri getiren tam bir macera deneyimi</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="card-hover rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.25)' }}>
                  <f.icon className="w-5 h-5 text-cr-gold" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2 uppercase" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-stroke" style={{ color: 'var(--text-primary)' }}>
          Savaşa Hazır mısın?
        </h2>
        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
          Neşve imparatorluğunu kuran binlerce kahramana katıl.
        </p>
        <Link to="/kayit" className="btn-duo btn-duo-green inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-lg">
          Hemen Katıl <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <footer className="relative z-10 py-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="flex flex-wrap justify-center gap-4 text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            <Link to="/hakkimizda" className="hover:text-cr-gold transition-colors">Hakkımızda</Link>
            <Link to="/iletisim" className="hover:text-cr-gold transition-colors">İletişim</Link>
            <Link to="/gizlilik" className="hover:text-cr-gold transition-colors">Gizlilik</Link>
            <Link to="/kullanim-kosullari" className="hover:text-cr-gold transition-colors">Koşullar</Link>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} Neşve</p>
        </div>
      </footer>
    </div>
  );
}
