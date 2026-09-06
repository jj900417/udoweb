import { mediaUrl, udoApi, type Banner } from '../api/udo';
import { useAsync } from '../api/useAsync';
import { useLocale } from '../i18n';

/*
 * 홈 배너 — 앱 홈 대시보드의 캐러셀과 **같은 자료**를 그대로 가져온다
 * (운영자가 콘솔에서 배너를 바꾸면 앱과 웹이 함께 바뀐다).
 *
 * - 여러 장이면 가로로 넘겨 본다(스크롤 스냅). 자동으로 넘기지 않는다 —
 *   읽는 중에 화면이 바뀌는 것은 성가시고 접근성에도 좋지 않다.
 * - 링크는 link_type='url' 일 때만 만든다. 'tab' 은 앱 안에서만 뜻이 있는
 *   딥링크라 웹에서는 그냥 그림으로 둔다.
 * - 배너가 없거나 못 받아오면 아무것도 그리지 않는다(자리만 차지하지 않게).
 */
function BannerImage({ banner }: { banner: Banner }) {
  const src = mediaUrl(banner.image);
  if (!src) return null;

  const image = (
    <img
      src={src}
      alt={banner.caption || ''}
      loading="lazy"
      className="h-auto w-full rounded-xl border border-line object-cover"
    />
  );

  const isLink = banner.link_type === 'url' && banner.link_value.startsWith('http');

  return (
    <figure className="w-[85%] shrink-0 snap-start sm:w-[48%] lg:w-[32%]">
      {isLink ? (
        <a href={banner.link_value} target="_blank" rel="noopener noreferrer">
          {image}
        </a>
      ) : (
        image
      )}
      {banner.caption && <figcaption className="caption mt-2">{banner.caption}</figcaption>}
    </figure>
  );
}

export default function BannerStrip() {
  const { locale } = useLocale();
  const { data } = useAsync((signal) => udoApi.banners(locale, signal), [locale]);
  const banners = data?.banners ?? [];
  if (banners.length === 0) return null;

  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
      {banners.map((banner) => (
        <BannerImage key={banner.id} banner={banner} />
      ))}
    </div>
  );
}
