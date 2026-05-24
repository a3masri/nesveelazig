import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export default function Privacy() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <nav className="px-6 py-4 max-w-3xl mx-auto border-b" style={{ borderColor: 'var(--border)' }}>
        <Logo size="md" linkTo="/" />
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-sm animate-fade-in" style={{ color: 'var(--text-secondary)' }}>
        <h1 className="font-display text-3xl font-bold text-stroke mb-6" style={{ color: 'var(--text-primary)' }}>
          Gizlilik Politikası
        </h1>
        <p className="mb-4">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
        <section className="space-y-4 text-sm leading-relaxed">
          <p>Neşve olarak kişisel verilerinizi KVKK kapsamında koruyoruz. E-posta, görünen ad ve kullanım verileriniz yalnızca sadakat programı hizmetleri için işlenir.</p>
          <p>Verileriniz üçüncü taraflarla paylaşılmaz. Hesabınızı istediğiniz zaman silebilir ve verilerinizin kaldırılmasını talep edebilirsiniz.</p>
          <p>Çerezler yalnızca oturum ve tema tercihleriniz için kullanılır.</p>
          <p>Sorularınız için: info@nesve.com</p>
        </section>
        <p className="mt-8">
          <Link to="/" className="text-sm hover:text-cr-gold transition-colors" style={{ color: 'var(--text-muted)' }}>← Ana sayfa</Link>
        </p>
      </main>
    </div>
  );
}
