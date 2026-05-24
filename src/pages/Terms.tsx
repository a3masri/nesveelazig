import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export default function Terms() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <nav className="px-6 py-4 max-w-3xl mx-auto border-b" style={{ borderColor: 'var(--border)' }}>
        <Logo size="md" linkTo="/" />
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-stroke mb-6" style={{ color: 'var(--text-primary)' }}>
          Kullanım Koşulları
        </h1>
        <section className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <p>Neşve platformunu kullanarak aşağıdaki koşulları kabul etmiş olursunuz.</p>
          <p><strong style={{ color: 'var(--text-primary)' }}>Hesap:</strong> Hesabınızın güvenliğinden siz sorumlusunuz. Sahte veya kötüye kullanım hesapları kapatılabilir.</p>
          <p><strong style={{ color: 'var(--text-primary)' }}>Kupalar ve ödüller:</strong> Kupalar mağaza içi alışverişlerle kazanılır. Ödül kartları süreli olabilir ve iade edilemez.</p>
          <p><strong style={{ color: 'var(--text-primary)' }}>Kodlar:</strong> Tek kullanımlık kodlar paylaşılamaz. Hile tespitinde hesap askıya alınır.</p>
          <p>Neşve, program koşullarını önceden haber vermeksizin güncelleme hakkını saklı tutar.</p>
        </section>
        <p className="mt-8">
          <Link to="/" className="text-sm hover:text-cr-gold transition-colors" style={{ color: 'var(--text-muted)' }}>← Ana sayfa</Link>
        </p>
      </main>
    </div>
  );
}
