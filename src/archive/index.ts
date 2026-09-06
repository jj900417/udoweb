/*
 * 아카이브 도메인의 공개 입구.
 * 화면(pages/components)은 여기서만 import 한다 — records/ 를 직접 읽지 않는다.
 */
export * from './ids';
export * from './types';
export * from './hooks';
export { entityPath, kindOfId } from './ids';
export { mediaUrl, aspectRatio } from './media';
export { usePlaceResolver, toPlaceRefId, toSitePlaceId } from './places';
export type { ArchivePlace } from './places';
export type { Archive, Facet, Facets, ListOptions, Visibility } from './repository';
export { createArchive, getArchive, dateSortKey, decadeOf } from './repository';
export type { RelatedGroup, ArchiveIndex, DroppedRef } from './relations';
export type { ArchiveDataset } from './records';

/*
 * 개발 중에만 도는 무결성 점검. Vite 가 프로덕션 빌드에서 통째로 제거한다.
 * 테스트 러너가 없는 저장소라 CI 게이트 대신 dev 콘솔 경고로 둔다.
 */
if (import.meta.env.DEV) {
  void (async () => {
    const [{ checkIntegrity }, { dataset }, { archiveTranslations }, { buildPlaceMap }, { places }] =
      await Promise.all([
        import('./integrity'),
        import('./records'),
        import('./i18n'),
        import('./places'),
        import('../data/spots'),
      ]);
    const translations = Object.values(archiveTranslations).filter((t) => t !== null);
    const placeIds = [...buildPlaceMap(places).keys()];
    const issues = checkIntegrity(dataset, translations, placeIds);
    if (issues.length > 0) console.warn('[archive] 무결성 점검', issues);
  })();
}
