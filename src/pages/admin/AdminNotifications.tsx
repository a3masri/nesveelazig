import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';
import {
  getNotifications,
  addNotification,
  deleteNotification,
  markNotificationRead,
} from '../../lib/notifications';
import type { AppNotification } from '../../lib/types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

export default function AdminNotifications() {
  const [list, setList] = useState<AppNotification[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<AppNotification['type']>('info');

  const load = () => setList(getNotifications());

  useEffect(() => {
    load();
  }, []);

  const handleCreate = () => {
    if (!title.trim() || !message.trim()) return;
    addNotification({ user_id: null, title: title.trim(), message: message.trim(), type });
    setShowCreate(false);
    setTitle('');
    setMessage('');
    load();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Bildirimler"
        subtitle="Kullanıcılara duyuru gönder"
        action={
          <button type="button" onClick={() => setShowCreate(true)} className="btn-duo btn-duo-green px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Yeni
          </button>
        }
      />

      <div className="space-y-2">
        {list.map(n => (
          <div
            key={n.id}
            className="surface-panel p-4 flex items-start gap-3"
            style={{ opacity: n.read ? 0.7 : 1 }}
          >
            <Bell className="w-5 h-5 text-cr-gold shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-sm">{n.title}</p>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-cr-blue/20 text-cr-blue">{n.type}</span>
                {n.user_id === null && (
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-cr-gold/20 text-cr-gold">Herkese</span>
                )}
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {n.message}
              </p>
              <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
                {new Date(n.created_at).toLocaleString('tr-TR')}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              {!n.read && (
                <button type="button" onClick={() => { markNotificationRead(n.id); load(); }} className="btn-duo btn-duo-ghost px-2 py-1 rounded-lg text-[10px]">
                  Okundu
                </button>
              )}
              <button type="button" onClick={() => { deleteNotification(n.id); load(); }} className="btn-duo btn-duo-red p-2 rounded-lg">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="surface-panel p-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Bildirim yok
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Bildirim Oluştur">
        <div className="space-y-4">
          <Input label="Başlık" value={title} onChange={e => setTitle(e.target.value)} />
          <div>
            <label className="text-xs font-bold uppercase mb-1 block">Mesaj</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              className="ui-input resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase mb-1 block">Tür</label>
            <select value={type} onChange={e => setType(e.target.value as AppNotification['type'])} className="ui-select w-full">
              <option value="info">Bilgi</option>
              <option value="success">Başarı</option>
              <option value="warning">Uyarı</option>
              <option value="promo">Kampanya</option>
            </select>
          </div>
          <button type="button" onClick={handleCreate} className="btn-duo btn-duo-green w-full py-3 rounded-2xl text-sm font-bold">
            Gönder (Herkese)
          </button>
        </div>
      </Modal>
    </div>
  );
}
