import { useState, useEffect } from 'react';
import { Search, Ban, Check, Star, Pencil, Plus, Minus, Trash2, UserPlus } from 'lucide-react';
import { getAllMembers, updateMember, adjustMemberPoints, createMember, deleteMember } from '../../lib/adminService';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { addAdminLog } from '../../lib/adminLogs';
import { useAuth } from '../../hooks/useAuth';
import type { Profile } from '../../lib/types';

export default function AdminMembers() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [editPoints, setEditPoints] = useState('');
  const [editName, setEditName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const load = () => setMembers(getAllMembers(search));

  useEffect(() => {
    load();
  }, [search]);

  const openEdit = (m: Profile) => {
    setSelected(m);
    setEditPoints(String(m.total_points));
    setEditName(m.display_name);
  };

  const saveMember = async () => {
    if (!selected) return;
    await updateMember(selected.id, {
      display_name: editName.trim(),
      total_points: parseInt(editPoints, 10) || 0,
    });
    addAdminLog({
      type: 'user',
      action: 'Üye güncellendi',
      actor_id: user?.id,
      actor_name: user?.displayName || 'Admin',
      target_id: selected.id,
      target_name: editName,
      details: `Kupa: ${editPoints}`,
    });
    setSelected(null);
    load();
  };

  const toggleBan = async (m: Profile) => {
    const next = m.status === 'banned' ? 'active' : 'banned';
    await updateMember(m.id, { status: next });
    addAdminLog({
      type: 'security',
      action: next === 'banned' ? 'Üye yasaklandı' : 'Yasak kaldırıldı',
      actor_id: user?.id,
      actor_name: 'Admin',
      target_id: m.id,
      target_name: m.display_name,
    });
    load();
    if (selected?.id === m.id) setSelected(null);
  };

  const quickPoints = async (m: Profile, delta: number) => {
    await adjustMemberPoints(m.id, delta);
    addAdminLog({
      type: 'user',
      action: delta > 0 ? 'Kupa eklendi' : 'Kupa düşüldü',
      actor_id: user?.id,
      actor_name: 'Admin',
      target_id: m.id,
      target_name: m.display_name,
      details: `${delta > 0 ? '+' : ''}${delta} kupa`,
    });
    load();
    if (selected?.id === m.id) {
      const updated = getAllMembers().find(x => x.id === m.id);
      if (updated) openEdit(updated);
    }
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    createMember(newName.trim(), newEmail.trim() || undefined);
    addAdminLog({ type: 'user', action: 'Üye oluşturuldu', actor_name: 'Admin', target_name: newName });
    setShowCreate(false);
    setNewName('');
    setNewEmail('');
    load();
  };

  const handleDelete = (m: Profile) => {
    if (!window.confirm(`${m.display_name} silinsin mi?`)) return;
    if (deleteMember(m.id)) {
      addAdminLog({ type: 'user', action: 'Üye silindi', actor_name: 'Admin', target_name: m.display_name });
      load();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Üye Yönetimi"
        subtitle="Oluştur, düzenle, yasakla veya sil"
        action={
          <button type="button" onClick={() => setShowCreate(true)} className="btn-duo btn-duo-green px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Yeni Üye
          </button>
        }
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cr-gold" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="İsim veya ID ara..."
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cr-gold/50"
          style={{ background: 'var(--bg-card)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
        />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="hidden sm:grid grid-cols-12 gap-2 p-3 text-[10px] font-bold uppercase border-b" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <span className="col-span-4">Üye</span>
          <span className="col-span-2">Arena</span>
          <span className="col-span-2">Kupa</span>
          <span className="col-span-2">Seri</span>
          <span className="col-span-2 text-right">İşlem</span>
        </div>
        {members.length === 0 ? (
          <p className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Üye bulunamadı
          </p>
        ) : (
          members.map(m => (
            <div
              key={m.id}
              className={`grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 border-b last:border-0 items-center ${m.status === 'banned' ? 'opacity-50' : ''}`}
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="sm:col-span-4">
                <p className="font-bold text-sm">{m.display_name}</p>
                <p className="text-[10px] font-mono truncate" style={{ color: 'var(--text-muted)' }}>
                  {m.id}
                </p>
                {m.status === 'banned' && (
                  <span className="text-[10px] font-bold text-cr-red uppercase">Yasaklı</span>
                )}
              </div>
              <span className="sm:col-span-2 text-xs">{m.current_rank}</span>
              <span className="sm:col-span-2 text-sm font-bold text-cr-gold">{m.total_points.toLocaleString('tr-TR')}</span>
              <span className="sm:col-span-2 text-xs">{m.streak_count}g</span>
              <div className="sm:col-span-2 flex gap-1 justify-end flex-wrap">
                <button type="button" onClick={() => quickPoints(m, 50)} className="btn-duo btn-duo-ghost p-2 rounded-lg" title="+50">
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => quickPoints(m, -50)} className="btn-duo btn-duo-ghost p-2 rounded-lg" title="-50">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => openEdit(m)} className="btn-duo btn-duo-blue p-2 rounded-lg">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => toggleBan(m)} className={`btn-duo p-2 rounded-lg ${m.status === 'banned' ? 'btn-duo-green' : 'btn-duo-red'}`}>
                  {m.status === 'banned' ? <Check className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                </button>
                <button type="button" onClick={() => handleDelete(m)} className="btn-duo btn-duo-red p-2 rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Yeni Üye">
        <div className="space-y-4">
          <Input label="Görünen Ad" value={newName} onChange={e => setNewName(e.target.value)} required />
          <Input label="E-posta (opsiyonel)" value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email" />
          <button type="button" onClick={handleCreate} className="btn-duo btn-duo-green w-full py-3 rounded-2xl text-sm font-bold">
            Oluştur
          </button>
        </div>
      </Modal>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative rounded-2xl p-6 max-w-md w-full space-y-4"
            style={{ background: 'var(--bg-card)', border: '2px solid var(--border)' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-lg uppercase flex items-center gap-2">
              <Star className="w-5 h-5 text-cr-gold" />
              Üye Düzenle
            </h3>
            <div>
              <label className="text-xs font-bold uppercase mb-1 block">Görünen Ad</label>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase mb-1 block">Toplam Kupa</label>
              <input
                type="number"
                value={editPoints}
                onChange={e => setEditPoints(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setSelected(null)} className="btn-duo btn-duo-ghost flex-1 py-2.5 rounded-xl text-sm">
                İptal
              </button>
              <button type="button" onClick={saveMember} className="btn-duo btn-duo-green flex-1 py-2.5 rounded-xl text-sm">
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
