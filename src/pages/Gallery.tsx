import SectionHeader from '../components/SectionHeader';
import GalleryGrid from '../components/GalleryGrid';
import { useContent } from '../i18n';

export default function Gallery() {
  const { site } = useContent();
  return (
    <>
      <SectionHeader
        title="우도의 얼굴"
        subtitle="현지 엠버서더와 방문자가 남긴 사진 — 계절·시간·날씨 태그가 붙어 있습니다"
        level={1}
      />
      <GalleryGrid limit={40} />
      <p className="mt-6 text-sm text-faint">
        사진은 {site.app.name} 앱을 통해 올라오고, 검수를 거친 것만 공개됩니다.
      </p>
    </>
  );
}
