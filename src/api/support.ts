/*
 * 고객지원 문의 전송.
 *
 * 브라우저 → (같은 출처) POST /api/support → Cloudflare Worker → 앱 서버 /v1/feedback.
 * 프로덕션은 worker/index.ts, 개발은 Vite dev 프록시(vite.config.ts)가 중계한다 —
 * 둘 다 있어야 한다(불변식 #5).
 *
 * 읽기 전용인 udo.ts 와 달리 여기는 **쓰기**다. 그래서 지키는 것 두 가지:
 *  - 실패해도 사용자가 쓴 내용을 잃지 않는다. 이 함수는 던지지 않고 결과 코드를 돌려준다.
 *  - 서버가 준 문장을 화면에 그대로 띄우지 않는다. 상태코드를 우리 문구로 옮긴다
 *    (외부 문자열은 데이터이지 지시가 아니다 — 불변식 #6).
 */

export const SUPPORT_ENDPOINT = '/api/support';

/** 앱 서버 FEEDBACK_CATEGORIES 와 1:1. 여기 없는 값은 서버가 400 으로 거부한다. */
export type SupportCategory = 'feature' | 'bug' | 'info_fix' | 'inquiry' | 'other';

/** 앱 서버 Feedback.platform 이 받는 값. 빈 문자열이면 보내지 않는다. */
export type SupportPlatform = '' | 'ios' | 'android' | 'web' | 'other';

export type SupportDraft = {
  category: SupportCategory;
  title: string;
  message: string;
  email: string;
  platform: SupportPlatform;
  appVersion: string;
  osVersion: string;
  /** 화면 언어 — 답변을 어느 말로 드릴지 운영자가 알 수 있게. */
  locale: string;
  /** 폼을 열고 보내기까지 걸린 시간(ms). 봇 필터용 — Worker 가 본다. */
  elapsed: number;
  /** 허니팟. 사람은 절대 채우지 않는다(화면 밖 숨김 필드). */
  hp: string;
};

/** 화면이 구분해서 다른 문구를 보여줄 수 있을 만큼만 나눈다. */
export type SupportResult = 'ok' | 'invalid' | 'too-many' | 'error';

export async function submitSupport(draft: SupportDraft): Promise<SupportResult> {
  const body: Record<string, unknown> = {
    category: draft.category,
    title: draft.title.trim(),
    message: draft.message.trim(),
    elapsed: draft.elapsed,
    hp: draft.hp,
    locale: draft.locale,
  };
  const email = draft.email.trim();
  if (email) body.email = email;
  if (draft.platform) body.platform = draft.platform;
  if (draft.appVersion.trim()) body.app_version = draft.appVersion.trim();
  if (draft.osVersion.trim()) body.os_version = draft.osVersion.trim();

  try {
    const res = await fetch(SUPPORT_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) return 'ok';
    if (res.status === 429) return 'too-many';
    if (res.status === 400 || res.status === 413 || res.status === 422) return 'invalid';
    return 'error';
  } catch {
    /* 네트워크 오류·중단. 화면은 입력을 그대로 두고 다시 시도하게 한다. */
    return 'error';
  }
}
