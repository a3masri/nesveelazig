import { useEffect, useState, useMemo } from 'react';
import { Star, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { CATEGORY_LABELS, getRankForPoints } from '../lib/constants';
import { getRewards, createTicket } from '../lib/db';
import { updateProfilePoints } from '../lib/profileUtils';
import type { Reward } from '../lib/types';
import { Confetti } from '../components/Particles';
import { AppHeader } from '../components/AppHeader';
import { CompactTicketCard } from '../components/ui/CompactTicketCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Modal } from '../components/ui/Modal';
import { TicketDetailSheet } from '../components/ui/TicketDetailSheet';
import { playPurchase, playCelebrate, playTab } from '../lib/sounds';

const CATEGORIES = ['all', 'coffee', 'tea', 'pastry', 'mystery', 'exclusive'] as const;

export default function Store() {
  const { user } = useAuth();
  const { profile, setProfile } = useProfile();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('all');
  const [search, setSearch] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [selected, setSelected] = useState<Reward | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');

  useEffect(() => {
    getRewards().then(data => {
      setRewards(data.filter(r => r.is_active));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = category === 'all' ? rewards : rewards.filter(r => r.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => a.point_cost - b.point_cost);
  }, [rewards, category, search]);

  const handlePurchase = async () => {
    if (!selected || !user || !profile) return;
    setPurchasing(true);
    setPurchaseError('');
    try {
      const newPoints = profile.total_points - selected.point_cost;
      if (newPoints < 0) {
        setPurchaseError('Yetersiz kupa');
        return;
      }
      if (selected.stock !== null && selected.stock <= 0) {
        setPurchaseError('Stok tükendi');
        return;
      }
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      await createTicket(user.id, selected, code);
      const { error } = await updateProfilePoints(user.id, newPoints);
      if (error) throw error;
      const rank = getRankForPoints(newPoints);
      await setProfile({ ...profile, total_points: newPoints, current_rank: rank.name });
      const refreshed = await getRewards();
      setRewards(refreshed.filter(r => r.is_active));
      playPurchase();
      playCelebrate();
      setShowConfetti(true);
      setPurchaseSuccess(true);
      setSelected(null);
      setTimeout(() => {
        setShowConfetti(false);
        setPurchaseSuccess(false);
      }, 2800);
    } catch {
      setPurchaseError('Satın alma başarısız');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const points = profile?.total_points ?? 0;

  return (
    <div className="pb-24 lg:pb-8 page-stack animate-fade-in overflow-x-hidden">
      <Confetti active={showConfetti} />
      <AppHeader title="Dükkan" subtitle={`${points.toLocaleString('tr-TR')} kupa`} />

      <input
        type="search"
        placeholder="Ödül ara..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="ui-input w-full min-h-[48px]"
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <button
            key={c}
            type="button"
            onClick={() => {
              playTab();
              setCategory(c);
            }}
            className={`shrink-0 px-3 py-2 rounded-lg text-[11px] font-bold uppercase min-h-[40px] ${
              category === c ? 'btn-duo btn-duo-blue' : 'btn-duo btn-duo-ghost'
            }`}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
        {filtered.map(reward => {
          const canAfford = points >= reward.point_cost;
          const outOfStock = reward.stock !== null && reward.stock <= 0;
          const locked = !canAfford || outOfStock;
          return (
            <CompactTicketCard
              key={reward.id}
              name={reward.name}
              emoji={reward.emoji}
              category={reward.category}
              rarity={reward.rarity}
              pointCost={reward.point_cost}
              locked={locked}
              disabled={locked}
              onClick={() => !locked && setSelected(reward)}
              showBuy={!locked}
              onBuy={() => setSelected(reward)}
            />
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="surface-panel p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Ürün bulunamadı
        </div>
      )}

      {purchaseError && (
        <p className="text-sm font-bold text-center py-3 rounded-xl bg-cr-red/10 border border-cr-red/30" style={{ color: '#FF8A80' }}>
          {purchaseError}
        </p>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} variant="sheet" maxWidth="max-w-md">
        {selected && (
          <TicketDetailSheet
            mode="shop"
            reward={selected}
            points={points}
            purchasing={purchasing}
            onBuy={handlePurchase}
            onClose={() => setSelected(null)}
          />
        )}
      </Modal>

      {purchaseSuccess && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none p-4">
          <div className="animate-bounce-in surface-panel p-8 max-w-sm w-full text-center">
            <Crown className="w-12 h-12 text-cr-gold mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold uppercase">Ödül koleksiyonuna eklendi</h3>
            <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
              Profilinden görüntüle
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
