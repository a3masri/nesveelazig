import { Link } from 'react-router-dom';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  linkTo?: string;
  className?: string;
  /** Use raster PNG (processed with alpha) instead of SVG */
  variant?: 'svg' | 'png';
};

const sizes = {
  sm: 'h-12',
  md: 'h-16',
  lg: 'h-20',
  xl: 'h-28',
  hero: 'h-36 sm:h-44',
};

const imgBase =
  'w-auto max-w-full object-contain object-center bg-transparent [background:none] select-none';

export function Logo({
  size = 'md',
  linkTo,
  className = '',
  variant = 'png',
}: LogoProps) {
  const sizeClass = sizes[size];

  const mark =
    variant === 'png' ? (
      <>
        <img
          src="/logo-light.png"
          alt="Neşve"
          className={`${sizeClass} ${imgBase} dark:hidden`}
          decoding="async"
          draggable={false}
        />
        <img
          src="/logo-dark.png"
          alt="Neşve"
          className={`${sizeClass} ${imgBase} hidden dark:block`}
          decoding="async"
          draggable={false}
        />
      </>
    ) : (
      <img
        src="/logo.svg"
        alt="Neşve"
        className={`nesve-logo ${sizeClass} ${imgBase} ${className}`}
        decoding="async"
        draggable={false}
      />
    );

  const content =
    variant === 'png' ? (
      <span className={`inline-flex items-center ${className}`}>{mark}</span>
    ) : (
      mark
    );

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className="inline-flex items-center bg-transparent hover:opacity-90 transition-opacity"
        aria-label="Neşve ana sayfa"
      >
        {content}
      </Link>
    );
  }

  return content;
}
