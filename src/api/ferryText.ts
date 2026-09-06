import type { FerryStatus } from './udo';

/*
 * 운항 문구 조립 — 서버의 code + params 를 화면 언어로 옮긴다.
 *
 * 앱(app/lib/i18n/labels.dart)과 **같은 방식·같은 문안**이다. 서버가 완성해 보내는
 * `headline` 문자열을 그대로 쓰면 두 가지가 어긋난다:
 *   ① 언어를 바꿔도 한국어가 그대로 나온다.
 *   ② 앱이 일부러 빼는 정보가 웹에만 새어 나온다(아래 first 참고).
 *
 * ★ 첫배 시각(params.first)은 **붙이지 않는다** — 앱이 내린 결정을 그대로 따른다:
 *   ① 어느 항구 첫배인지 말할 수 없다. 서버 값은 모든 노선 중 가장 이른 시각(union)이라
 *      성산(08:00)도 천진(07:30)도 아닌 값이다.
 *   ② '내일 첫배'를 오늘 기준 계절로 계산해서 달이 바뀌는 날(8/31→9/1)에 어긋난다.
 *   항구별 정확한 첫배는 운항 시간표가 말한다.
 *
 * 모르는 code 는 서버 문장으로 폴백한다(구버전 서버·새 code 대응).
 */
type Params = Record<string, string | number> | undefined;

function fill(template: string, params: Params): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (whole, key: string) => {
    const value = params[key];
    return value === undefined ? whole : String(value);
  });
}

type FerryChrome = {
  headlines: Record<string, string>;
  reasons: Record<string, string>;
  warningKinds: Record<string, string>;
};

export function statusHeadline(status: FerryStatus['status'], chrome: FerryChrome): string {
  const template = status.headline_code ? chrome.headlines[status.headline_code] : undefined;
  if (!template) return status.headline;
  return fill(template, status.headline_params);
}

export function statusReasons(status: FerryStatus['status'], chrome: FerryChrome): string[] {
  const items = status.reason_items;
  if (!items || items.length === 0) return status.reasons ?? [];

  return items
    .map((item) => {
      const params = { ...(item.params ?? {}) };
      /* 특보 종류(태풍·경보·주의보…)도 코드다 — 사람이 읽는 말로 바꿔 끼운다. */
      if (typeof params.kind === 'string') {
        params.kind = chrome.warningKinds[params.kind] ?? params.kind;
      }
      const template = chrome.reasons[item.code];
      if (template) return fill(template, params);
      /* 운영자가 직접 쓴 자유 문장은 code 없이 text 로 온다. */
      return typeof params.text === 'string' ? params.text : '';
    })
    .filter((line) => line.length > 0);
}
