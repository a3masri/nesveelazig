import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Logo } from '../components/Logo';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto border-b" style={{ borderColor: 'var(--border)' }}>
        <Logo size="md" linkTo="/" />
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
        <h1 className="font-display text-4xl font-bold text-stroke mb-2" style={{ color: 'var(--text-primary)' }}>
          İletişim
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          Sorularınız veya önerileriniz için bize ulaşın.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              { icon: MapPin, label: 'Adres', value: 'İstanbul, Türkiye' },
              { icon: Mail, label: 'E-posta', value: 'info@nesve.com' },
              { icon: Phone, label: 'Telefon', value: '+90 (212) 000 00 00' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <item.icon className="w-5 h-5 text-cr-gold" />
                <div>
                  <div className="text-xs uppercase font-bold" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {sent ? (
            <div className="rounded-2xl p-8 text-center flex items-center justify-center" style={{ background: 'var(--bg-card)', border: '2px solid rgba(76,175,80,0.4)' }}>
              <p className="text-cr-green font-bold">Mesajınız alındı! En kısa sürede dönüş yapacağız.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <input
                required
                placeholder="Adınız"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cr-gold/50"
                style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
              />
              <input
                required
                type="email"
                placeholder="E-posta"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cr-gold/50"
                style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
              />
              <textarea
                required
                rows={4}
                placeholder="Mesajınız"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cr-gold/50 resize-none"
                style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
              />
              <button type="submit" className="btn-duo btn-duo-green w-full py-3 rounded-2xl text-sm flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Gönder
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-8">
          <Link to="/" className="text-sm hover:text-cr-gold transition-colors" style={{ color: 'var(--text-muted)' }}>
            ← Ana sayfaya dön
          </Link>
        </p>
      </main>
    </div>
  );
}
