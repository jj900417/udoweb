import { useMemo } from 'react';
import { udoApi } from '../api/udo';
import { useAsync } from '../api/useAsync';
import { useContent } from '../i18n';

/*
 * 앱 설치 버튼.
 *
 * - 스토어 주소는 **앱 서버가 단일 소스**(/v1/app/requirements). iOS 가 등재되면
 *   서버 설정만 바뀌고 이 코드는 그대로다.
 * - 기기에 맞는 스토어로 보낸다: iOS → App Store, 그 외 → Google Play.
 * - 아직 출시 전(site.app.storeLive=false)이거나 그 플랫폼 주소가 비어 있으면
 *   **스토어로 보내지 않는다.** 등재 전 주소는 오류 페이지로 가기 때문이다 —
 *   대신 '출시 준비 중'을 밝히고 웹으로 여는 길을 준다.
 */
type Platform = 'ios' | 'android' | 'other';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  /* 아이패드(iPadOS 13+)는 데스크톱 UA 를 쓴다 — 터치 지원으로 가려낸다. */
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'other';
}

export default function InstallButton() {
  const { site, ui } = useContent();
  const { data } = useAsync((signal) => udoApi.appRequirements(signal));
  const platform = useMemo(detectPlatform, []);

  const storeUrl = !data
    ? ''
    : platform === 'ios'
      ? data.store_url_ios
      : data.store_url_android;

  const canInstall = site.app.storeLive && Boolean(storeUrl);

  if (canInstall) {
    return (
      <a href={storeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
        {ui.app.install}
      </a>
    );
  }

  return (
    <>
      <a href={site.app.web} target="_blank" rel="noopener noreferrer" className="btn-ghost">
        {ui.app.openWeb}
      </a>
      <span className="caption self-center">{ui.app.comingSoon}</span>
    </>
  );
}
