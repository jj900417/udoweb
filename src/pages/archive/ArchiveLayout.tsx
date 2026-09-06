import { Outlet } from 'react-router-dom';
import ArchiveNav from '../../components/archive/ArchiveNav';

/*
 * /archive/* 공통 껍데기 — 2차 내비를 한 곳에서만 그린다.
 * 랜딩(/archive)은 '입구' 성격이라 내비 없이 큰 섹션만 보여주므로 여기에 포함하지 않는다.
 */
export default function ArchiveLayout() {
  return (
    <>
      <ArchiveNav />
      <Outlet />
    </>
  );
}
