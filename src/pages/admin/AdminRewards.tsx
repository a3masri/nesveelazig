import { useState, useEffect } from 'react';
import { Gift, ToggleLeft, ToggleRight, Plus, Trash2 } from 'lucide-react';
import { getRewardsAdmin, updateRewardAdmin, createReward, deleteReward } from '../../lib/adminService';
import { addAdminLog } from '../../lib/adminLogs';
import { RARITY_LABELS, CATEGORY_LABELS } from '../../lib/constants';
import type { Reward } from '../../lib/types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const EMPTY: Omit<Reward, 'id'> = {
  name: '',
  description: '',
  image_url: '',
  point_cost: 50,
  category: 'coffee',
  rarity: 'common',
  is_active: true,
  stock: 99,
  emoji: '☕',
};

export default function AdminRewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = () => setRewards(getRewardsAdmin());

  useEffect(() => {
    load();
  }, []);

  const toggleActive = (r: Reward) => {
    updateRewardAdmin(r.id, { is_active: !r.is_active });
    addAdminLog({
      type: 'reward',
      action: r.is_active ? 'Ödül devre dışı' : 'Ödül aktifleştirildi',
      actor_name: 'Admin',
      target_name: r.name,
    });
    load();
  };

  const handleCreate = () => {
    if (!form.name.trim()) return;
    createReward(form);
    addAdminLog({ type: 'reward', action: 'Ödül oluşturuldu', actor_name: 'Admin', target_name: form.name });
    setShowCreate(false);
    setForm(EMPTY);
    load();
  };

  const handleDelete = (r: Reward) => {
    if (!window.confirm(`"${r.name}" silinsin mi?`)) return;
    deleteReward(r.id);
    addAdminLog({ type: 'reward', action: 'Ödül silindi', actor_name: 'Admin', target_name: r.name });
    load();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Ödül & Dükkan"
        subtitle="Ürün CRUD — fiyat, stok, aktiflik"
        action={
          <button type="button" onClick={() => setShowCreate(true)} className="btn-duo btn-duo-green px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Yeni Ürün
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {rewards.map(r => (
          <div
            key={r.id}
            className={`surface-panel p-4 space-y-3 ${!r.is_active ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-3xl shrink-0">{r.emoji || '☕'}</span>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm uppercase truncate">{r.name}</h3>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {CATEGORY_LABELS[r.category]} · {RARITY_LABELS[r.rarity]}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button type="button" onClick={() => toggleActive(r)} className="p-1" aria-label="Aktiflik">
                  {r.is_active ? <ToggleRight className="w-7 h-7 text-cr-green" /> : <ToggleLeft className="w-7 h-7" style={{ color: 'var(--text-muted)' }} />}
                </button>
                <button type="button" onClick={() => handleDelete(r)} className="btn-duo btn-duo-red p-1.5 rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {r.description}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase block mb-1">Kupa</label>
                <input
                  type="number"
                  defaultValue={r.point_cost}
                  onBlur={e => updateRewardAdmin(r.id, { point_cost: Math.max(1, parseInt(e.target.value, 10) || r.point_cost) })}
                  className="ui-input py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase block mb-1">Stok</label>
                <input
                  type="number"
                  defaultValue={r.stock ?? 0}
                  onBlur={e => updateRewardAdmin(r.id, { stock: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                  className="ui-input py-1.5 text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {rewards.length === 0 && (
        <div className="surface-panel p-12 text-center">
          <Gift className="w-12 h-12 mx-auto mb-3 text-cr-gold" />
          <p style={{ color: 'var(--text-muted)' }}>Ödül bulunamadı</p>
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Yeni Ürün" maxWidth="max-w-lg">
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          <Input label="Ad" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div>
            <label className="text-xs font-bold uppercase mb-1 block">Açıklama</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="ui-input resize-none" />
          </div>
          <Input label="Emoji" value={form.emoji || ''} onChange={e => setForm({ ...form, emoji: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase mb-1 block">Kategori</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="ui-select w-full">
                {Object.entries(CATEGORY_LABELS).filter(([k]) => k !== 'all').map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase mb-1 block">Nadirlik</label>
              <select value={form.rarity} onChange={e => setForm({ ...form, rarity: e.target.value })} className="ui-select w-full">
                {Object.entries(RARITY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Kupa" type="number" value={form.point_cost} onChange={e => setForm({ ...form, point_cost: parseInt(e.target.value, 10) || 0 })} />
            <Input label="Stok" type="number" value={form.stock ?? 0} onChange={e => setForm({ ...form, stock: parseInt(e.target.value, 10) || 0 })} />
          </div>
          <button type="button" onClick={handleCreate} className="btn-duo btn-duo-green w-full py-3 rounded-2xl text-sm font-bold">
            Oluştur
          </button>
        </div>
      </Modal>
    </div>
  );
}
