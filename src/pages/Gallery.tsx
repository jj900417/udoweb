import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import GalleryGrid from '../components/GalleryGrid';
import PageMeta from '../components/PageMeta';
import { useContent } from '../i18n';

/*
 * '현재의 우도' — 우도 나우 앱으로 올라온 방문자·엠버서더 사진 스트림.
 *
 * /archive 의 작품과 **데이터 모델이 완전히 다르다**: 이쪽은 앱 서버가 단일 소스이고
 * 정사각 썸네일로 흐르는 스트림, 저쪽은 큐레이션된 작품(원본 비율·권리·출처).
 * 둘을 섞지 않는다.
 */
export default function Gallery() {
  const { site, ui, archive } = useContent();

  return (
    <>
      <PageMeta title={ui.gallery.title} description={ui.gallery.subtitle} />
      <SectionHeader title={ui.gallery.title} subtitle={ui.gallery.subtitle} level={1} />

      <GalleryGrid limit={40} />

      <p className="mt-6 text-sm text-faint">
        {ui.gallery.source.replace('{app}', site.app.name)}
      </p>
      <p className="mt-2 text-sm text-faint">
        {ui.gallery.note}{' '}
        <Link to="/archive" className="font-semibold text-brand hover:text-brand-strong">
          {archive.sections.works.title} →
        </Link>
      </p>
    </>
  );
}
