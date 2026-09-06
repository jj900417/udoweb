import { useContent } from '../i18n';
import { useTheme } from '../theme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { ui } = useContent();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? ui.theme.light : ui.theme.dark}
      className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-ink-soft
        transition-colors hover:border-brand hover:text-link"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
