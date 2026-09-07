import { useLocation } from 'react-router-dom';
import { useLocale } from '../i18n';
import { locales, type LocaleCode } from '../i18n/locales';
import { localizedPath } from '../i18n/route';

/*
 * 언어를 고르면 주소가 같이 바뀌어요.
 *
 * 예전에는 화면만 바뀌고 주소는 그대로였어요. 그러면 일본어로 보다가 링크를
 * 복사해 보내도 받는 사람은 한국어를 봐요 — 고른 언어가 그 사람 브라우저 안에만
 * 있었으니까요. 이제 `/ja/spots` 처럼 주소에 남아서 공유가 돼요.
 *
 * `window.location` 으로 통째로 이동해요. `navigate()` 는 지금 라우터의
 * basename 안에서만 움직이는데, 우리가 바꾸려는 게 바로 그 basename 이거든요.
 */
export default function LocaleSelect() {
  const { locale } = useLocale();
  const location = useLocation();

  return (
    <label className="inline-flex items-center">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(e) => {
          const next = e.target.value as LocaleCode;
          /* location.pathname 은 basename 이 떼어진 값이라 그대로 다시 붙이면 돼요. */
          window.location.assign(localizedPath(next, location.pathname) + location.search);
        }}
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
