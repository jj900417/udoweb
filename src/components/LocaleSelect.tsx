import { useLocale } from '../i18n';
import { locales, type LocaleCode } from '../i18n/locales';

export default function LocaleSelect() {
  const { locale, setLocale } = useLocale();
  return (
    <label className="inline-flex items-center">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as LocaleCode)}
        className="rounded-lg border border-line bg-surface px-2 py-1.5 text-xs text-ink-soft
          transition-colors hover:border-brand focus:border-brand"
      >
        {locales.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
