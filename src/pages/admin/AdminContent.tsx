import { useState, useEffect } from 'react';
import { FileText, Save } from 'lucide-react';
import { getContentBlocks, saveContentBlock } from '../../lib/contentStore';
import type { ContentBlock } from '../../lib/types';
import { PageHeader } from '../../components/ui/PageHeader';
import { addAdminLog } from '../../lib/adminLogs';

export default function AdminContent() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [active, setActive] = useState<ContentBlock | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const list = getContentBlocks();
    setBlocks(list);
    setActive(list[0] || null);
  }, []);

  const handleSave = () => {
    if (!active) return;
    saveContentBlock(active);
    addAdminLog({ type: 'system', action: 'İçerik güncellendi', actor_name: 'Admin', details: active.title });
    setBlocks(getContentBlocks());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="İçerik Yönetimi" subtitle="Sayfa metinlerini düzenle" />

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-48 space-y-1">
          {blocks.map(b => (
            <button
              key={b.id}
              type="button"
              onClick={() => setActive({ ...b })}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold uppercase ${active?.id === b.id ? 'bg-cr-gold/20 text-cr-gold' : 'hover:bg-cr-gold/5'}`}
              style={{ color: active?.id === b.id ? '#FFD700' : 'var(--text-secondary)' }}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              {b.title}
            </button>
          ))}
        </div>

        {active && (
          <div className="flex-1 surface-panel p-5 space-y-4">
            <Input label="Başlık" value={active.title} onChange={e => setActive({ ...active, title: e.target.value })} />
            <div>
              <label className="text-xs font-bold uppercase mb-1 block">İçerik</label>
              <textarea
                value={active.body}
                onChange={e => setActive({ ...active, body: e.target.value })}
                rows={12}
                className="ui-input resize-y min-h-[200px] font-body normal-case"
              />
            </div>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Slug: /{active.slug} · Son güncelleme: {new Date(active.updated_at).toLocaleString('tr-TR')}
            </p>
            <button type="button" onClick={handleSave} className="btn-duo btn-duo-green px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saved ? 'Kaydedildi!' : 'Kaydet'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase mb-1 block">{label}</label>
      <input value={value} onChange={onChange} className="ui-input" />
    </div>
  );
}
