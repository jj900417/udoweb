import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import SectionHeader from '../components/SectionHeader';
import CctvList from '../components/CctvList';

/*
 * 항구 — 천진항·하우목동항의 실시간 화면.
 *
 * CCTV 는 여기 한 곳에만 둔다('오늘의 우도'에서는 이 페이지로 보낸다) — 같은 영상을
 * 두 화면에서 각각 재생하면 상류(제주시) 요청도 두 배가 된다.
 */
export default function Harbor() {
  const { harbor } = useContent();

  return (
    <>
      <PageMeta title={harbor.title} description={harbor.subtitle} />
      <SectionHeader title={harbor.title} subtitle={harbor.subtitle} level={1} />
      <CctvList />
      <p className="caption mt-6">{harbor.note}</p>
    </>
  );
}
