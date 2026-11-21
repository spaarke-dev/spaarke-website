import { useAudience, type Audience } from '../audience/AudienceContext';

const OPTIONS: { value: Audience; label: string }[] = [
  { value: 'firm', label: 'Law Firm' },
  { value: 'corporate', label: 'Corporate' },
];

/** Site-wide switch. Place once in the sticky header. */
export function AudienceToggle() {
  const { audience, setAudience } = useAudience();
  return (
    <div className="audience-toggle" role="radiogroup" aria-label="View this page as">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={audience === o.value}
          className={audience === o.value ? 'is-active' : undefined}
          onClick={() => setAudience(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
