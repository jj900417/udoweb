import { useEffect } from 'react';
import { useContent } from '../i18n';

/*
 * 라우트별 <title> · meta description. 라이브러리를 더하지 않고 useEffect 로만 쓴다.
 *
 * 한계: SPA 라 크롤러가 JS 를 실행하지 않으면 index.html 의 기본값만 본다
 * (카톡·페북 미리보기 등). 향후 prerender/SSR 검토 — docs/media-storage.md 참고.
 */
export default function PageMeta({ title, description }: { title?: string; description?: string }) {
  const { site } = useContent();

  useEffect(() => {
    const base = `${site.name} · ${site.tagline}`;
    document.title = title ? `${title} — ${site.name}` : base;

    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = 'description';
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description, site.name, site.tagline]);

  return null;
}
