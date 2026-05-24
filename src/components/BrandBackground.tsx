/** Fixed subtle emoji decorations — static, never scrolls */
const DECO = [
  { emoji: '☕', className: 'brand-deco brand-deco--1' },
  { emoji: '🥐', className: 'brand-deco brand-deco--2' },
  { emoji: '✨', className: 'brand-deco brand-deco--3' },
  { emoji: '🍰', className: 'brand-deco brand-deco--4' },
  { emoji: '🍪', className: 'brand-deco brand-deco--5' },
  { emoji: '🫖', className: 'brand-deco brand-deco--6' },
  { emoji: '✨', className: 'brand-deco brand-deco--7' },
  { emoji: '🧁', className: 'brand-deco brand-deco--8' },
];

export function BrandBackground() {
  return (
    <div className="brand-bg" aria-hidden>
      {DECO.map((d, i) => (
        <span key={i} className={d.className}>
          {d.emoji}
        </span>
      ))}
    </div>
  );
}
