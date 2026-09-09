import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useContent, useLocale } from '../i18n';
import PageMeta from '../components/PageMeta';
import SectionHeader from '../components/SectionHeader';
import {
  submitSupport,
  type SupportCategory,
  type SupportPlatform,
  type SupportResult,
} from '../api/support';

/*
 * 고객지원 — 문의·건의·오류 신고.
 *
 * App Store Connect 의 Support URL 로 쓰는 페이지다. **로그인 없이** 열리고 제출된다.
 * 보낸 내용은 우도 나우 앱 서버의 건의사항 창구로 들어가고, 운영자가 앱 문의와 같은
 * 곳에서 확인한다(worker/index.ts 의 /api/support 참고).
 *
 * 지키는 것:
 *  - 실패해도 입력을 지우지 않는다. 길게 쓴 문의가 전송 오류 한 번에 사라지면 안 된다.
 *  - alert() 를 쓰지 않는다. 완료도 오류도 화면 안에서 말한다.
 *  - prerender(SSR) 중에는 브라우저 API 를 부르지 않는다. Date.now() 는 제출 시점에만 쓴다.
 */

const CATEGORIES: readonly SupportCategory[] = ['feature', 'bug', 'info_fix', 'inquiry', 'other'];
const PLATFORMS: readonly SupportPlatform[] = ['', 'ios', 'android', 'web', 'other'];

/* 서버 컬럼 길이와 같은 상한. 넘치면 서버가 400 을 준다. */
const TITLE_MAX = 100;
const MESSAGE_MAX = 5000;

/** 앱이 붙여 보내는 ?platform= 값. 모르는 값이 와도 화면이 깨지지 않게 조용히 버린다. */
function readPlatform(raw: string | null): SupportPlatform {
  const v = (raw ?? '').trim().toLowerCase();
  return (PLATFORMS as readonly string[]).includes(v) ? (v as SupportPlatform) : '';
}

/** 자유 입력 쿼리(?version=, ?os=) — 길이만 잘라서 초기값으로 쓴다. 사용자가 고칠 수 있다. */
function readText(raw: string | null, max: number): string {
  return (raw ?? '').trim().slice(0, max);
}

export default function Support() {
  const { support, site, ui } = useContent();
  const { locale } = useLocale();
  const [params] = useSearchParams();

  /* 앱에서 넘어온 값은 **초기값**일 뿐이다 — 이후에는 사용자가 고친 값이 이긴다. */
  const [category, setCategory] = useState<SupportCategory>('bug');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState<SupportPlatform>(() => readPlatform(params.get('platform')));
  const [appVersion, setAppVersion] = useState(() => readText(params.get('version'), 20));
  const [osVersion, setOsVersion] = useState(() => readText(params.get('os'), 40));
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  /* 오류가 났을 때·다 보냈을 때 초점을 옮길 자리. 키보드·스크린리더 사용자는
     화면 어딘가에 뜬 문구를 스스로 찾아가지 못한다. */
  const doneRef = useRef<HTMLHeadingElement>(null);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<SupportResult | null>(null);
  const [sentWithEmail, setSentWithEmail] = useState<boolean | null>(null);

  /* 사용 환경 칸이 하나라도 차 있으면 접이식을 펼친 채로 시작한다(앱에서 들어온 경우). */
  const [envOpen, setEnvOpen] = useState(
    () => Boolean(platform || appVersion || osVersion),
  );

  /* 폼을 처음 그린 시각. 봇 필터(최소 작성 시간)용 — 렌더 중 Date.now() 를 부르지만
     값을 화면에 쓰지 않으므로 SSR 결과가 달라지지 않는다. */
  const openedAt = useRef(Date.now());

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!CATEGORIES.includes(category)) next.category = support.errors.category;
    if (!title.trim()) next.title = support.errors.title;
    if (!message.trim()) next.message = support.errors.message;
    const mail = email.trim();
    if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) next.email = support.errors.email;
    if (!consent) next.consent = support.errors.consent;
    return next;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFailure(null);
      /* 첫 번째 문제 칸으로 초점을 옮긴다 — 폼이 길어서 스크롤 밖에 있을 수 있다. */
      const first = ['category', 'title', 'message', 'email', 'consent'].find((k) => found[k]);
      event.currentTarget.querySelector<HTMLElement>(`#support-${first}`)?.focus();
      return;
    }

    setSending(true);
    setFailure(null);
    const hadEmail = Boolean(email.trim());
    const result = await submitSupport({
      category,
      title,
      message,
      email,
      platform,
      appVersion,
      osVersion,
      locale,
      elapsed: Date.now() - openedAt.current,
      hp,
    });
    setSending(false);

    if (result === 'ok') {
      setSentWithEmail(hadEmail);
      /* 폼이 사라지고 완료 문구가 그 자리에 온다 — 초점이 허공에 남지 않게 옮긴다. */
      window.setTimeout(() => doneRef.current?.focus(), 0);
      return;
    }
    /* 실패 — 입력은 그대로 둔다. */
    setFailure(result);
  }

  function reset() {
    setSentWithEmail(null);
    setTitle('');
    setMessage('');
    setEmail('');
    setConsent(false);
    setErrors({});
    setFailure(null);
    openedAt.current = Date.now();
  }

  const failureText =
    failure === 'invalid'
      ? support.errors.invalid
      : failure === 'too-many'
        ? support.errors.tooMany
        : failure === 'error'
          ? support.errors.network
          : '';

  return (
    <>
      <PageMeta title={support.title} description={support.subtitle} />

      <SectionHeader title={support.title} subtitle={support.subtitle} level={1} />

      <p className="measure prose-body">{support.intro}</p>

      {sentWithEmail !== null ? (
        <div className="measure mt-8 card" role="status" aria-live="polite">
          <h2 className="text-xl font-bold text-ink" ref={doneRef} tabIndex={-1}>
            {support.doneTitle}
          </h2>
          <p className="mt-2 prose-body">{support.doneBody}</p>
          {sentWithEmail && <p className="mt-2 prose-body">{support.doneEmail}</p>}
          <button type="button" className="btn-ghost mt-5" onClick={reset}>
            {support.doneAgain}
          </button>
        </div>
      ) : (
        <form className="measure mt-8 space-y-6" onSubmit={onSubmit} noValidate>
          {/* 전송 결과는 폼 맨 위에서 말한다 — 버튼 옆에만 두면 긴 폼에서 안 보인다. */}
          <p aria-live="polite" className={failureText ? 'field-error' : 'sr-only'}>
            {failureText}
          </p>

          <div>
            <label className="field-label" htmlFor="support-category">
              {support.categoryLabel}
            </label>
            <select
              id="support-category"
              className="field"
              value={category}
              onChange={(e) => setCategory(e.target.value as SupportCategory)}
            >
              {support.categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="support-title">
              {support.titleLabel}
            </label>
            <input
              id="support-title"
              className="field"
              type="text"
              value={title}
              maxLength={TITLE_MAX}
              placeholder={support.titlePlaceholder}
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={errors.title ? 'support-title-error' : undefined}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p className="field-error" id="support-title-error">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="field-label" htmlFor="support-message">
              {support.messageLabel}
            </label>
            <textarea
              id="support-message"
              className="field min-h-44"
              value={message}
              maxLength={MESSAGE_MAX}
              placeholder={support.messagePlaceholder}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={
                errors.message ? 'support-message-error support-message-count' : 'support-message-count'
              }
              onChange={(e) => setMessage(e.target.value)}
            />
            <p className="field-hint" id="support-message-count">
              {support.remaining.replace('{n}', String(MESSAGE_MAX - message.length))}
            </p>
            {errors.message && (
              <p className="field-error" id="support-message-error">
                {errors.message}
              </p>
            )}
          </div>

          <div>
            <label className="field-label" htmlFor="support-email">
              {support.emailLabel}
            </label>
            <input
              id="support-email"
              className="field"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              maxLength={254}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={
                errors.email ? 'support-email-error support-email-hint' : 'support-email-hint'
              }
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="field-hint" id="support-email-hint">
              {support.emailHint}
            </p>
            {errors.email && (
              <p className="field-error" id="support-email-error">
                {errors.email}
              </p>
            )}
          </div>

          {/*
            사용 환경 — 일반 문의에는 필요 없는 칸이라 접어 둔다.
            <details> 대신 버튼을 쓰는 이유: 기존 화면(NowHub)의 펼침 규칙과 같은 방식으로
            aria-expanded/aria-controls 를 붙이기 위해서다.
          */}
          <div className="card">
            <button
              type="button"
              className="flex w-full items-center justify-between text-sm font-semibold text-link"
              aria-expanded={envOpen}
              aria-controls="support-env"
              onClick={() => setEnvOpen((open) => !open)}
            >
              <span>{support.envTitle}</span>
              <span aria-hidden>{envOpen ? '▾' : '▸'}</span>
            </button>

            {envOpen && (
              <div className="mt-4 space-y-4" id="support-env">
                <p className="field-hint mt-0">{support.envHint}</p>

                <div>
                  <label className="field-label" htmlFor="support-platform">
                    {support.platformLabel}
                  </label>
                  <select
                    id="support-platform"
                    className="field"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as SupportPlatform)}
                  >
                    {support.platforms.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="field-label" htmlFor="support-app-version">
                    {support.appVersionLabel}
                  </label>
                  <input
                    id="support-app-version"
                    className="field"
                    type="text"
                    value={appVersion}
                    maxLength={20}
                    placeholder={support.appVersionPlaceholder}
                    onChange={(e) => setAppVersion(e.target.value)}
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="support-os-version">
                    {support.osVersionLabel}
                  </label>
                  <input
                    id="support-os-version"
                    className="field"
                    type="text"
                    value={osVersion}
                    maxLength={40}
                    placeholder={support.osVersionPlaceholder}
                    onChange={(e) => setOsVersion(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/*
            허니팟 — 사람 눈에도 스크린리더에도 없는 칸. 자동 제출 봇만 채운다.
            hidden 속성 대신 화면 밖으로 보내는 이유: display:none 필드는 건너뛰는 봇이 있다.
          */}
          <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
            <label htmlFor="support-hp">Leave this field empty</label>
            <input
              id="support-hp"
              name="hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />
          </div>

          <div className="card">
            <h2 className="font-bold text-ink">{support.privacyTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{support.privacyBody}</p>
            <p className="mt-2">
              {/* 방침 원문은 앱 서버가 단일 소스다 — Worker 가 /privacy 로 중계한다. */}
              <a className="text-sm font-semibold text-link" href="/privacy">
                {support.privacyLink}
              </a>
            </p>
            <label className="mt-4 flex items-start gap-2.5 text-sm text-ink">
              <input
                id="support-consent"
                type="checkbox"
                className="mt-0.5 size-4 shrink-0 accent-cta"
                checked={consent}
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? 'support-consent-error' : undefined}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>{support.consentLabel}</span>
            </label>
            {errors.consent && (
              <p className="field-error" id="support-consent-error">
                {errors.consent}
              </p>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={sending}>
            {sending ? support.submitting : support.submit}
          </button>
        </form>
      )}

      <div className="measure mt-14">
        <SectionHeader title={support.altTitle} />
        <p className="prose-body">{support.altBody}</p>
        <p className="mt-2">
          <a className="font-semibold text-link" href={`mailto:${site.operator.email}`}>
            {site.operator.email}
          </a>
        </p>
        <p className="mt-6">
          <Link className="text-sm font-semibold text-link" to="/app">
            {site.app.name} {ui.actions.more}
          </Link>
        </p>
      </div>
    </>
  );
}
